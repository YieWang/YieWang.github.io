#!/bin/zsh
cd -- "${0:A:h}" || exit 1
# Finder may launch without the interactive shell's fnm environment.
if ! command -v node >/dev/null && [[ -x /opt/homebrew/bin/fnm ]]; then
  eval "$(/opt/homebrew/bin/fnm env --shell zsh)"
fi
if ! command -v node >/dev/null || [[ ! -d node_modules ]]; then
  print '未找到 Node.js 或项目依赖。请让 Codex 检查本地环境后再启动。'
  read '?按回车关闭…'
  exit 1
fi
if curl --noproxy '*' --fail --silent --max-time 2 http://127.0.0.1:4399/__editor/status | /usr/bin/grep -q '"editor":true'; then
  open 'http://127.0.0.1:4399/marginalia'
  exit 0
fi
if lsof -nP -iTCP:4399 -sTCP:LISTEN >/dev/null 2>&1; then
  print '编辑器端口 4399 已被占用，但编辑接口不可用。请让 Codex 检查并停止占用此端口的测试服务，再双击启动。'
  read '?按回车关闭…'
  exit 1
fi
print '正在打开本地主页。保持此窗口开启；按 Control-C 停止。'
export HOMEPAGE_EDITOR=1
exec node node_modules/astro/astro.js dev --host 127.0.0.1 --port 4399 --open /marginalia
