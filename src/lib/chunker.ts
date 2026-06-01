const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;

export function chunkText(text: string): string[] {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    const end = start + CHUNK_SIZE;

    chunks.push(text.slice(start, end).trim());

    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks.filter(Boolean);
}