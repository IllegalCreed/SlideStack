#!/bin/bash
# ============================================================
# SlideStack 部署脚本（国内服务器）
# 用法: ./scripts/deploy.sh [package-name|all]
# 示例: ./scripts/deploy.sh husky-slide
#       ./scripts/deploy.sh all
# ============================================================

set -e

# 服务器配置
SERVER_HOST="47.120.26.143"
SERVER_USER="root"

# 远程路径（SlideStack 是 VitePress 站点的子目录）
REMOTE_DIR="/var/www/illegal-site/SlideStack"

# 本地路径
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查 SSH 连接
check_ssh() {
  log_info "检查 SSH 连接..."
  if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "${SERVER_USER}@${SERVER_HOST}" 'echo ok' &>/dev/null; then
    log_error "无法连接到服务器。请确认 SSH key 已配置。"
    log_warn "提示: ssh-copy-id ${SERVER_USER}@${SERVER_HOST}"
    exit 1
  fi
}

# 构建指定 package 或全部
build() {
  local target=$1
  cd "$PROJECT_ROOT"
  pnpm install

  if [ "$target" = "all" ]; then
    log_info "构建全部幻灯片..."
    pnpm -r build
  else
    log_info "构建 ${target}..."
    pnpm -C "packages/${target}" run build
  fi
}

# 部署指定 package
deploy_package() {
  local pkg_name=$1
  local local_dist="${PROJECT_ROOT}/packages/${pkg_name}/dist"

  if [ ! -d "$local_dist" ]; then
    log_warn "跳过 ${pkg_name}：dist 目录不存在"
    return
  fi

  log_info "部署 ${pkg_name}..."
  ssh "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE_DIR}/${pkg_name}"
  rsync -avz --delete \
    "${local_dist}/" \
    "${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}/${pkg_name}/"
}

# 部署全部
deploy_all() {
  for pkg in "${PROJECT_ROOT}"/packages/*; do
    if [ -d "$pkg/dist" ]; then
      deploy_package "$(basename "$pkg")"
    fi
  done
}

# 主逻辑
main() {
  local target="${1:-all}"

  echo "========================================"
  echo "  SlideStack 部署"
  echo "  目标: ${target}"
  echo "  服务器: ${SERVER_HOST}"
  echo "========================================"
  echo ""

  check_ssh
  build "$target"

  if [ "$target" = "all" ]; then
    deploy_all
  else
    deploy_package "$target"
  fi

  echo ""
  log_info "部署完成！"
  echo ""
  echo "  幻灯片:  https://illegalscreed.cn/SlideStack/"
}

main "$@"
