export type StorageWriter = Pick<Storage, "getItem" | "setItem">;
export function saveQuizResult(storage: StorageWriter, slug: string, score: number, difficulty: string, elapsedSeconds: number): number {
  const bestKey = `woori-quiz:best:${slug}`;
  const best = Math.max(score, Number(storage.getItem(bestKey) || 0));
  storage.setItem(bestKey, String(best));
  storage.setItem(`woori-quiz:recent:${slug}`, String(score));
  storage.setItem(`woori-quiz:difficulty:${slug}`, difficulty);
  storage.setItem(`woori-quiz:elapsed:${slug}`, String(elapsedSeconds));
  storage.setItem("woori-quiz:last-played", slug);
  return best;
}
