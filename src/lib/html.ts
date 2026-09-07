// Imported metadata is plain text, including inside modal HTML attributes.
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

export function secondaryNames(primary: string[], ...names: (string | undefined)[]): string {
  const normalize = (name: string) => name.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const seen = new Set(primary.map(normalize));
  return names.filter((name): name is string => {
    if (!name?.trim()) return false;
    const key = normalize(name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(name => name.trim()).join(' · ');
}
