// Imported metadata is plain text, including inside modal HTML attributes.
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

export function secondaryNames(primary: string[], ...names: (string | undefined)[]): string {
  // Audited spelling variants; preserve distinct translations and native metadata.
  const canonical = (name: string) => (nameVariants as Record<string, string>)[name.trim()] || name.trim();
  const normalize = (name: string) => name.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const seen = new Set(primary.map(name => normalize(canonical(name))));
  return names.map(name => name && canonical(name)).filter((name): name is string => {
    if (!name?.trim()) return false;
    const key = normalize(name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(name => name.trim()).join(' · ');
}

export function creatorNames(primary: string, original?: string, chinese?: string): string {
  // Preserve empty slots so each translated name stays with its credited creator.
  const split = (names = '') => names.split(/\s*[,，、;；]\s*|\s+\/\s+/).map(name => name.trim());
  const directors = split(primary), originals = split(original), translations = split(chinese);
  const localized = directors.map((name, index) => secondaryNames([name], originals[index], translations[index]));
  // A mixed-language credit must still include creators such as ONE and TYPE-MOON.
  return localized.some(Boolean) ? localized.map((name, index) => name || directors[index]).join(' · ') : '';
}
import nameVariants from '../data/screen-name-variants.json';
