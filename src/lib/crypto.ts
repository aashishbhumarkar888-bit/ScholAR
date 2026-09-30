/**
 * Cryptographic utility for ScholAR Tamper-Evident Audit Ledger.
 * Uses standard W3C Web Cryptography API (SHA-256).
 */

export async function computeSHA256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function truncateHash(hash: string, startChars: number = 8, endChars: number = 6): string {
  if (!hash || hash.length <= startChars + endChars) return hash;
  return `${hash.slice(0, startChars)}…${hash.slice(-endChars)}`;
}
