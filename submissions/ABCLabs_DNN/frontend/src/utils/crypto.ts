// helper to create a deterministic bio-hash from a string using SubtleCrypto
export async function genBioHash(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  if (typeof window !== 'undefined' && window.crypto && (window.crypto as any).subtle) {
    const hash = await (window.crypto as any).subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // fallback to simple JS hash if SubtleCrypto not available
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h << 5) - h + input.charCodeAt(i) | 0;
  return Math.abs(h).toString(16);
}
