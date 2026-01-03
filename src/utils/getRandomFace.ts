// Minimal utility to fetch a random AI-generated face URL from FakeFace
// Returns the image URL string or null on error.
export async function getRandomFace(opts?: { signal?: AbortSignal; retries?: number }): Promise<string | null> {
  const endpoint = (typeof import.meta !== "undefined" && (import.meta as any)?.env?.DEV)
    ? "/api/fakeface"
    : "https://fakeface.rest/face/json";
  const retries = opts?.retries ?? 2;
  const isDev = typeof import.meta !== "undefined" && (import.meta as any)?.env?.MODE !== "production";

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: opts?.signal,
      });
      if (isDev) {
        console.log("[FakeFace] fetch", {
          attempt,
          ok: res.ok,
          status: res.status,
          url: endpoint,
          contentType: res.headers.get("content-type"),
        });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (isDev) {
        console.log("[FakeFace] response data", data);
      }
      const url = typeof data?.image_url === "string" ? data.image_url : null;
      if (!url) throw new Error("Missing image_url");
      return url;
    } catch (err) {
      // AbortError is expected in dev (React StrictMode mounts/unmounts); don't treat as failure.
      if ((err as any)?.name === "AbortError") {
        if (isDev) console.info("[FakeFace] aborted (cleanup)", { attempt });
        return null;
      }
      if (isDev) console.error("[FakeFace] error", { attempt, error: err });
      if (attempt === retries) {
        console.error("getRandomFace failed:", err);
        return null;
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  return null;
}