#!/bin/zsh
cd -- "${0:A:h}" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v node >/dev/null && [[ -x /opt/homebrew/bin/fnm ]]; then
  eval "$(/opt/homebrew/bin/fnm env --shell zsh)"
fi
if ! command -v node >/dev/null || [[ ! -d node_modules ]]; then
  print '未找到 Node.js 或项目依赖。请在本项目目录安装依赖后重试。'
  read '?按回车关闭…'
  exit 1
fi
node scripts/publish.mjs "$@"
publish_result=$?
read '?按回车关闭…'
exit $publish_result
