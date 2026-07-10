<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const stage = ref<HTMLDivElement | null>(null);
const speed = ref(0.75);
const roughness = ref(0.32);
const lightPower = ref(3.2);
const color = ref("#4fd1c5");
const wireframe = ref(false);
const paused = ref(false);
const drawCalls = ref(0);
const triangles = ref(0);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let mesh: THREE.Mesh<
  THREE.TorusKnotGeometry,
  THREE.MeshStandardMaterial
> | null = null;
let keyLight: THREE.DirectionalLight | null = null;
let orbitControls: OrbitControls | null = null;
let resizeObserver: ResizeObserver | null = null;
let frameCount = 0;

/** 根据容器真实尺寸同步画布与相机宽高比。 */
function resizeScene() {
  if (!stage.value || !renderer || !camera) return;
  const width = Math.max(1, stage.value.clientWidth);
  const height = Math.max(1, stage.value.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

/** 切换动画暂停状态。 */
function togglePaused() {
  paused.value = !paused.value;
}

watch([roughness, color, wireframe], () => {
  if (!mesh) return;
  mesh.material.roughness = roughness.value;
  mesh.material.color.set(color.value);
  mesh.material.wireframe = wireframe.value;
});

watch(lightPower, () => {
  if (keyLight) keyLight.intensity = lightPower.value;
});

onMounted(() => {
  if (!stage.value) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1020);

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(3.4, 2.2, 4.6);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.dataset.threeDemo = "active";
  renderer.domElement.setAttribute(
    "aria-label",
    "可交互的 Three.js 环面结演示",
  );
  stage.value.appendChild(renderer.domElement);

  const geometry = new THREE.TorusKnotGeometry(1, 0.32, 180, 28);
  const material = new THREE.MeshStandardMaterial({
    color: color.value,
    roughness: roughness.value,
    metalness: 0.42,
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  scene.add(mesh);

  const floorGeometry = new THREE.CircleGeometry(4.8, 64);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x172033,
    roughness: 0.9,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.45;
  floor.receiveShadow = true;
  floor.name = "demo-floor";
  scene.add(floor);

  keyLight = new THREE.DirectionalLight(0xffffff, lightPower.value);
  keyLight.position.set(3, 5, 4);
  keyLight.castShadow = true;
  scene.add(keyLight);
  scene.add(new THREE.HemisphereLight(0x93c5fd, 0x3f1d2e, 1.35));

  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.enablePan = false;
  orbitControls.minDistance = 3;
  orbitControls.maxDistance = 8;

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const delta = Math.min(clock.getDelta(), 0.05);
    if (mesh && !paused.value) {
      mesh.rotation.x += delta * speed.value * 0.42;
      mesh.rotation.y += delta * speed.value;
    }
    orbitControls?.update();
    if (scene && camera && renderer) {
      renderer.render(scene, camera);
      frameCount += 1;
      if (frameCount % 15 === 0) {
        drawCalls.value = renderer.info.render.calls;
        triangles.value = renderer.info.render.triangles;
      }
    }
  });

  resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(stage.value);
  resizeScene();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  orbitControls?.dispose();
  renderer?.setAnimationLoop(null);
  if (scene) {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) material.dispose();
    });
  }
  renderer?.dispose();
  renderer?.forceContextLoss();
  renderer?.domElement.remove();
  renderer = null;
  scene = null;
  camera = null;
  mesh = null;
  keyLight = null;
  orbitControls = null;
});
</script>

<template>
  <section class="three-demo" aria-label="Three.js 参数实验台">
    <div ref="stage" class="three-demo__stage" data-testid="three-scene" />

    <div class="three-demo__controls">
      <label>
        <span>速度</span>
        <input
          v-model.number="speed"
          type="range"
          min="0"
          max="2"
          step="0.05"
        />
        <output>{{ speed.toFixed(2) }}×</output>
      </label>

      <label>
        <span>粗糙度</span>
        <input
          v-model.number="roughness"
          type="range"
          min="0"
          max="1"
          step="0.02"
        />
        <output>{{ roughness.toFixed(2) }}</output>
      </label>

      <label>
        <span>主光</span>
        <input
          v-model.number="lightPower"
          type="range"
          min="0"
          max="7"
          step="0.1"
        />
        <output>{{ lightPower.toFixed(1) }}</output>
      </label>

      <label class="three-demo__color">
        <span>颜色</span>
        <input v-model="color" type="color" aria-label="材质颜色" />
      </label>

      <label class="three-demo__check">
        <input v-model="wireframe" type="checkbox" />
        <span>线框</span>
      </label>

      <button
        type="button"
        class="three-demo__toggle"
        :aria-label="paused ? '继续动画' : '暂停动画'"
        :title="paused ? '继续动画' : '暂停动画'"
        @click="togglePaused"
      >
        <carbon:play-filled-alt v-if="paused" />
        <carbon:pause-filled v-else />
      </button>
    </div>

    <footer class="three-demo__stats">
      <span>WebGLRenderer · r185</span>
      <span
        >draw calls {{ drawCalls }} · triangles
        {{ triangles.toLocaleString() }}</span
      >
      <span>拖动旋转 · 滚轮缩放</span>
    </footer>
  </section>
</template>

<style scoped>
.three-demo {
  display: grid;
  grid-template-rows: 315px auto 28px;
  width: 100%;
  overflow: hidden;
  color: #e5e7eb;
  background: #0b1020;
}

.three-demo__stage {
  position: relative;
  min-width: 0;
  min-height: 0;
}

.three-demo__stage :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
}

.three-demo__stage :deep(canvas:active) {
  cursor: grabbing;
}

.three-demo__controls {
  display: grid;
  grid-template-columns: 1.35fr 1.35fr 1.35fr 72px 74px 38px;
  align-items: center;
  gap: 10px;
  min-height: 62px;
  padding: 8px 12px;
  background: #111827;
  border-top: 1px solid #334155;
}

.three-demo__controls label {
  display: grid;
  grid-template-columns: auto minmax(60px, 1fr) 36px;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 12px;
}

.three-demo__controls label > span {
  color: #9ca3af;
}

.three-demo__controls input[type="range"] {
  width: 100%;
  accent-color: #4fd1c5;
}

.three-demo__controls output {
  color: #fbbf24;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: right;
}

.three-demo__color,
.three-demo__check {
  grid-template-columns: auto auto !important;
}

.three-demo__color input {
  width: 30px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: 1px solid #475569;
  border-radius: 4px;
}

.three-demo__check input {
  accent-color: #fbbf24;
}

.three-demo__toggle {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: #111827;
  font-weight: 800;
  background: #fbbf24;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.three-demo__toggle svg {
  width: 18px;
  height: 18px;
}

.three-demo__stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: #94a3b8;
  font:
    11px ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  background: #172033;
}
</style>
