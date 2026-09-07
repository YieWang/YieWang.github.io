"""python3 tests/editor-launchers.py — check Node setup without inherited shell state."""
import os
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[1]
for name in ('筛选影视.command', '编辑主页.command'):
    script = (root / name).read_text()
    # Exercise the launcher's actual setup, without starting or opening a server.
    setup = script.split('if curl ', 1)[0] + '\nnode --version\n'
    result = subprocess.run(
        ['/bin/zsh', '-c', setup, str(root / name)],
        env={'HOME': os.environ['HOME'], 'PATH': '/usr/bin:/bin:/usr/sbin:/sbin'},
        stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=10,
    )
    assert result.returncode == 0 and result.stdout.strip().startswith('v'), result
    print(name + ': clean environment passed')
