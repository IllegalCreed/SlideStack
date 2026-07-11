<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from "vue";

/**
 * 本地回环连接实验室：同页两个真实 RTCPeerConnection 互连。
 * 信令退化为内存直传（offer/answer 互 set、候选互 addIceCandidate），
 * 建立 RTCDataChannel 后双向收发，实时展示两端三个状态徽标。
 * SSR 安全：一切 WebRTC 构造都发生在按钮回调里，顶层零 window 访问。
 */

/** 单端视图：connectionState / iceConnectionState / DataChannel readyState */
interface PeerView {
  conn: string;
  ice: string;
  dc: string;
}

type Phase = "idle" | "connecting" | "connected" | "closed";

const a = reactive<PeerView>({ conn: "-", ice: "-", dc: "-" });
const b = reactive<PeerView>({ conn: "-", ice: "-", dc: "-" });
const phase = ref<Phase>("idle");
const entries = ref<{ dir: "ab" | "ba"; text: string }[]>([]);

let pcA: RTCPeerConnection | null = null;
let pcB: RTCPeerConnection | null = null;
let dcA: RTCDataChannel | null = null;
let dcB: RTCDataChannel | null = null;
let seq = 0;

/** 追加一条消息日志，最多保留 4 条 */
function pushLog(dir: "ab" | "ba", text: string) {
  entries.value = [...entries.value.slice(-3), { dir, text }];
}

/** A 端通道接线：收到 pong 就用带回的时间戳算 RTT */
function wireA(dc: RTCDataChannel) {
  a.dc = dc.readyState;
  dc.onopen = () => (a.dc = dc.readyState);
  dc.onclose = () => (a.dc = dc.readyState);
  dc.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.kind === "pong") {
      const rtt = (performance.now() - msg.t).toFixed(1);
      pushLog("ba", `pong #${msg.n} —— RTT ${rtt} ms`);
    } else {
      pushLog("ba", msg.text);
    }
  };
}

/** B 端通道接线：收到 ping 原样带回时间戳回 pong */
function wireB(dc: RTCDataChannel) {
  dcB = dc;
  b.dc = dc.readyState;
  dc.onopen = () => (b.dc = dc.readyState);
  dc.onclose = () => (b.dc = dc.readyState);
  dc.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.kind === "ping") {
      pushLog("ab", `ping #${msg.n}`);
      dc.send(JSON.stringify({ kind: "pong", n: msg.n, t: msg.t }));
    }
  };
}

/** 观察一端的两个连接状态机，驱动徽标与总相位 */
function observe(pc: RTCPeerConnection, view: PeerView) {
  view.conn = pc.connectionState;
  view.ice = pc.iceConnectionState;
  pc.onconnectionstatechange = () => {
    view.conn = pc.connectionState;
    if (
      pcA?.connectionState === "connected" &&
      pcB?.connectionState === "connected"
    ) {
      phase.value = "connected";
    }
  };
  pc.oniceconnectionstatechange = () => (view.ice = pc.iceConnectionState);
}

/** 真实建连：四个 set/create 调用 + 候选互喂，全程真 WebRTC API */
async function connect() {
  teardown(); // 重开前先清场
  phase.value = "connecting";
  entries.value = [];
  seq = 0;

  // 同机回环 host 候选直达，可以不配 iceServers
  pcA = new RTCPeerConnection();
  pcB = new RTCPeerConnection();
  observe(pcA, a);
  observe(pcB, b);

  // 候选互递（真实场景：这两行经信令服务器转发给对端）
  pcA.onicecandidate = ({ candidate }) => {
    if (candidate) pcB?.addIceCandidate(candidate).catch(() => {});
  };
  pcB.onicecandidate = ({ candidate }) => {
    if (candidate) pcA?.addIceCandidate(candidate).catch(() => {});
  };

  // A 建 in-band 通道；B 靠 datachannel 事件接住
  dcA = pcA.createDataChannel("loopback");
  wireA(dcA);
  pcB.ondatachannel = ({ channel }) => wireB(channel);

  // offer/answer：四个调用、两次「投递」（此处即内存互 set）
  await pcA.setLocalDescription(await pcA.createOffer());
  await pcB.setRemoteDescription(pcA.localDescription!);
  await pcB.setLocalDescription(await pcB.createAnswer());
  await pcA.setRemoteDescription(pcB.localDescription!);
}

/** A → B 发 ping：对端回 pong，A 端算一次往返时延 */
function pingFromA() {
  if (dcA?.readyState !== "open") return;
  seq += 1;
  dcA.send(JSON.stringify({ kind: "ping", n: seq, t: performance.now() }));
}

/** B → A 发一条普通文本消息（验证反方向同样可发） */
function sendFromB() {
  if (dcB?.readyState !== "open") return;
  seq += 1;
  dcB.send(JSON.stringify({ kind: "chat", text: `来自 B 的第 ${seq} 条消息` }));
}

/** 关闭并释放两端；close() 不再触发状态事件，徽标手动刷新 */
function teardown() {
  dcA?.close();
  dcB?.close();
  pcA?.close();
  pcB?.close();
  if (pcA) {
    a.conn = pcA.connectionState;
    a.ice = pcA.iceConnectionState;
    a.dc = dcA?.readyState ?? "-";
  }
  if (pcB) {
    b.conn = pcB.connectionState;
    b.ice = pcB.iceConnectionState;
    b.dc = dcB?.readyState ?? "-";
  }
  pcA = pcB = null;
  dcA = dcB = null;
}

/** 手动挂断：closed 是终态，重连必须新建实例 */
function disconnect() {
  teardown();
  phase.value = "closed";
}

const canSend = computed(() => a.dc === "open" && b.dc === "open");
const live = computed(
  () => phase.value === "connecting" || phase.value === "connected",
);

const phaseText = computed(() => {
  switch (phase.value) {
    case "idle":
      return "待建立——offer/answer 与候选将在页面内存里直传（信令退化为变量）";
    case "connecting":
      return "编排中：createOffer → 四个 set 调用 → 候选互喂 → ICE 连通性检查…";
    case "connected":
      return "双端 connected：数据面 P2P 打通（同机回环，host 候选直达）";
    case "closed":
      return "已 close()——closed 是终态，重连必须新建 RTCPeerConnection";
    default:
      return "";
  }
});

// 组件卸载兜底：关闭在途连接，释放资源
onUnmounted(teardown);
</script>

<template>
  <section class="loop-lab" aria-label="WebRTC 本地回环连接实验">
    <div class="loop-lab__controls">
      <button
        type="button"
        class="loop-lab__btn loop-lab__btn--connect"
        :disabled="phase === 'connecting'"
        @click="connect"
      >
        建立连接
      </button>
      <button
        type="button"
        class="loop-lab__btn loop-lab__btn--send"
        :disabled="!canSend"
        @click="pingFromA"
      >
        A → B 发 ping（测 RTT）
      </button>
      <button
        type="button"
        class="loop-lab__btn loop-lab__btn--send"
        :disabled="!canSend"
        @click="sendFromB"
      >
        B → A 发消息
      </button>
      <button
        type="button"
        class="loop-lab__btn loop-lab__btn--close"
        :disabled="!live"
        @click="disconnect"
      >
        close()
      </button>
    </div>

    <div class="loop-lab__peers">
      <div class="loop-lab__peer">
        <strong>端 A · 呼叫方（建通道）</strong>
        <span class="loop-lab__badge" :data-s="a.conn" data-testid="peer-a-conn">
          connectionState · {{ a.conn }}
        </span>
        <span class="loop-lab__badge" :data-s="a.ice" data-testid="peer-a-ice">
          iceConnectionState · {{ a.ice }}
        </span>
        <span class="loop-lab__badge" :data-s="a.dc" data-testid="peer-a-dc">
          dataChannel · {{ a.dc }}
        </span>
      </div>
      <div class="loop-lab__wire">
        <code>loopback</code>
        <span class="loop-lab__wire-line"></span>
        <span class="loop-lab__wire-label">SCTP / DTLS / ICE</span>
      </div>
      <div class="loop-lab__peer">
        <strong>端 B · 应答方（事件接）</strong>
        <span class="loop-lab__badge" :data-s="b.conn" data-testid="peer-b-conn">
          connectionState · {{ b.conn }}
        </span>
        <span class="loop-lab__badge" :data-s="b.ice" data-testid="peer-b-ice">
          iceConnectionState · {{ b.ice }}
        </span>
        <span class="loop-lab__badge" :data-s="b.dc" data-testid="peer-b-dc">
          dataChannel · {{ b.dc }}
        </span>
      </div>
    </div>

    <div class="loop-lab__log" data-testid="lab-log">
      <div v-if="!entries.length" class="loop-lab__log-empty">
        消息日志：连接建立后，双向 send() 的往返会出现在这里
      </div>
      <div
        v-for="(e, i) in entries"
        :key="i"
        :class="['loop-lab__msg', `loop-lab__msg--${e.dir}`]"
      >
        <code>{{ e.dir === "ab" ? "A → B" : "B → A" }}</code>
        <span>{{ e.text }}</span>
      </div>
    </div>

    <div class="loop-lab__status" :data-phase="phase" data-testid="lab-phase">
      {{ phaseText }}
    </div>
  </section>
</template>

<style scoped>
.loop-lab {
  display: grid;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.loop-lab__controls {
  display: flex;
  gap: 10px;
}

.loop-lab__btn {
  min-height: 34px;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 700;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.loop-lab__btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.loop-lab__btn--connect {
  color: #052e16;
  background: #4ade80;
}

.loop-lab__btn--send {
  color: #eff6ff;
  background: #2563eb;
}

.loop-lab__btn--close {
  color: #fef3c7;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #92400e;
}

.loop-lab__peers {
  display: grid;
  align-items: stretch;
  gap: 12px;
  grid-template-columns: 1fr 132px 1fr;
}

.loop-lab__peer {
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.loop-lab__peer strong {
  font-size: 12.5px;
}

.loop-lab__badge {
  padding: 3px 8px;
  color: #cbd5e1;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11.5px;
  background: #1f2937;
  border-left: 3px solid #64748b;
  border-radius: 3px;
}

.loop-lab__badge[data-s="connected"],
.loop-lab__badge[data-s="completed"],
.loop-lab__badge[data-s="open"] {
  color: #bbf7d0;
  border-left-color: #34d399;
}

.loop-lab__badge[data-s="connecting"],
.loop-lab__badge[data-s="checking"],
.loop-lab__badge[data-s="new"] {
  color: #bfdbfe;
  border-left-color: #60a5fa;
}

.loop-lab__badge[data-s="disconnected"],
.loop-lab__badge[data-s="closing"],
.loop-lab__badge[data-s="closed"] {
  color: #fde68a;
  border-left-color: #fbbf24;
}

.loop-lab__badge[data-s="failed"] {
  color: #fecdd3;
  border-left-color: #fb7185;
}

.loop-lab__wire {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 11px;
  text-align: center;
}

.loop-lab__wire code {
  color: #fbbf24;
}

.loop-lab__wire-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #60a5fa, #34d399);
  border-radius: 999px;
}

.loop-lab__log {
  display: grid;
  gap: 4px;
  align-content: start;
  height: 104px;
  overflow: hidden;
  padding: 8px 10px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.loop-lab__log-empty {
  color: #64748b;
  font-size: 12px;
}

.loop-lab__msg {
  display: flex;
  gap: 10px;
  align-items: baseline;
  font-size: 12.5px;
}

.loop-lab__msg code {
  flex: none;
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 3px;
}

.loop-lab__msg--ab code {
  color: #0f172a;
  background: #60a5fa;
}

.loop-lab__msg--ba code {
  color: #0f172a;
  background: #34d399;
}

.loop-lab__status {
  padding: 7px 12px;
  font-size: 12.5px;
  background: #0f172a;
  border-left: 4px solid #64748b;
  border-radius: 4px;
}

.loop-lab__status[data-phase="connecting"] {
  border-left-color: #60a5fa;
}

.loop-lab__status[data-phase="connected"] {
  border-left-color: #34d399;
}

.loop-lab__status[data-phase="closed"] {
  border-left-color: #fbbf24;
}
</style>
