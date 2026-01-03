import { getRandomFace } from "./getRandomFace";
const isDev = typeof import.meta !== "undefined" && (import.meta as any)?.env?.DEV === true;

type Task = {
  key: string;
  resolve: (url: string | null) => void;
  reject: (err: any) => void;
  opts?: { signal?: AbortSignal; retries?: number };
};

const cache = new Map<string, string>();
const queue: Task[] = [];
let active = 0;
const MAX_CONCURRENCY = 6; // limit concurrent API requests to avoid rate limiting

function runNext() {
  while (active < MAX_CONCURRENCY && queue.length > 0) {
    const task = queue.shift()!;
    active++;
    if (isDev) console.log("[FacesPool] start", { key: task.key, active });
    getRandomFace(task.opts)
      .then((url) => {
        if (url) cache.set(task.key, url);
        if (isDev) console.log("[FacesPool] done", { key: task.key, url: Boolean(url) });
        task.resolve(url ?? null);
      })
      .catch((err) => {
        // Resolve with null on error to allow fallback rendering
        if (isDev) console.warn("[FacesPool] error", { key: task.key, err });
        task.resolve(null);
      })
      .finally(() => {
        active--;
        if (isDev) console.log("[FacesPool] release", { key: task.key, active });
        runNext();
      });
  }
}

export function getFacePooled(
  key: string,
  opts?: { signal?: AbortSignal; retries?: number }
): Promise<string | null> {
  if (cache.has(key)) {
    if (isDev) console.log("[FacesPool] hit cache", { key });
    return Promise.resolve(cache.get(key)!);
  }
  return new Promise((resolve, reject) => {
    if (isDev) console.log("[FacesPool] enqueue", { key });
    queue.push({ key, resolve, reject, opts });
    runNext();
  });
}

export function clearFaceCache() {
  cache.clear();
}