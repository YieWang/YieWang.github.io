"""python3 tests/editor-launchers.py — check Node setup without inherited shell state."""
import os
from pathlib import Path
import subprocess
import tempfile

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

# Exercise each full launcher without opening a browser or claiming a real port.
with tempfile.TemporaryDirectory() as directory:
    commands = {
        'curl': '[ "$CASE" = ready ] && echo \'{"editor":true}\'',
        'lsof': '[ "$CASE" = occupied ]',
        'open': 'echo "OPEN $*"',
        'node': 'echo "START editor=$HOMEPAGE_EDITOR $*"',
    }
    for name, body in commands.items():
        path = Path(directory) / name
        path.write_text('#!/bin/sh\n' + body + '\n')
        path.chmod(0o755)
    for name, route in (('编辑主页.command', '/marginalia'), ('筛选影视.command', '/__editor/cinema')):
        for case in ('ready', 'occupied', 'free'):
            result = subprocess.run(
                ['/bin/zsh', str(root / name)],
                env={**os.environ, 'PATH': directory + ':/usr/bin:/bin:/usr/sbin:/sbin', 'CASE': case},
                stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=10,
            )
            assert result.returncode == (1 if case == 'occupied' else 0), result
            if case == 'ready':
                assert result.stdout.strip() == 'OPEN http://127.0.0.1:4399' + route, result
            elif case == 'occupied':
                assert '4399 已被占用' in result.stdout, result
                assert 'START ' not in result.stdout and 'OPEN ' not in result.stdout, result
            else:
                assert 'START editor=1 node_modules/astro/astro.js dev --host 127.0.0.1 --port 4399 --open ' + route in result.stdout, result
        print(name + ': reuse, port conflict and fresh start passed')
