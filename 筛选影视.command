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
if curl --silent --max-time 2 http://127.0.0.1:4399/__editor/status | /usr/bin/grep -q '"editor":true'; then
  open 'http://127.0.0.1:4399/__editor/cinema'
  exit 0
fi
print '正在打开影视筛选器。保持此窗口开启；按 Control-C 停止。'
export HOMEPAGE_EDITOR=1
node node_modules/astro/astro.js dev --host 127.0.0.1 --port 4399 --open /__editor/cinema
