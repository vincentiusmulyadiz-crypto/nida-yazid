/**
 * Aturan format nama orang tua:
 * Maksimal 2 baris terpusat rapi:
 * - Baris pertama: Putra/Putri dari [Nama Ayah]
 * - Baris kedua: & [Nama Ibu]
 */
export function formatParentsLines(prefix: string, rawParents: string) {
  if (!rawParents) return { line1: '', line2: '' };

  let father = '';
  let mother = '';

  if (rawParents.includes('&')) {
    const parts = rawParents.split('&');
    father = parts[0].trim();
    mother = parts.slice(1).join('&').trim();
  } else if (/\s+dan\s+/i.test(rawParents)) {
    const parts = rawParents.split(/\s+dan\s+/i);
    father = parts[0].trim();
    mother = parts.slice(1).join(' dan ').trim();
  } else if (rawParents.includes('\n')) {
    const parts = rawParents.split('\n');
    father = parts[0].trim();
    mother = parts.slice(1).join('\n').trim();
  } else {
    return { line1: `${prefix ? prefix + ' ' : ''}${rawParents}`.trim(), line2: '' };
  }

  const line1 = `${prefix ? prefix + ' ' : ''}${father}`.trim();
  const line2 = mother ? `& ${mother}` : '';
  return { line1, line2 };
}
