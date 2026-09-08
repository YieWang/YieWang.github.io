import { readFileSync } from 'node:fs';
import { basename, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the actual data modules, with optional JSON inputs for ordering regressions.
export function loadData(name, inputs = {}) {
  const cache = new Map();
  function load(file) {
    if (!extname(file)) file += '.ts';
    if (cache.has(file)) return cache.get(file);
    if (file.endsWith('.json')) {
      const data = inputs[basename(file)] ?? JSON.parse(readFileSync(file, 'utf8'));
      return { ...data, default: data };
    }
    const exports = {};
    cache.set(file, exports);
    vm.runInNewContext(ts.transpile(readFileSync(file, 'utf8'), {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    }), { exports, require: path => load(resolve(file, '..', path)) });
    return exports;
  }
  return load(fileURLToPath(new URL('../src/data/' + name, import.meta.url)));
}
