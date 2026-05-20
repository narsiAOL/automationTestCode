const normalizeImageUrl = (imgUrl: string): string[] => {
  if (!imgUrl || imgUrl.trim() === "") return [];
  
  const normalized: string[] = [];
  
  // data URLs should be returned as-is
  if (/^data:image\//i.test(imgUrl)) {
  return [imgUrl];
  }
  
  // Absolute URLs as-is
  if (/^https?:\/\//i.test(imgUrl) || /^blob:/i.test(imgUrl)) {
  return [imgUrl];
  }
  
  // If it's a path or filename, try API host and local origin
  const apiBase = (import.meta.env.VITE_PUBLIC_API_URL || "").replace(/\/$/, "");
  if (apiBase) {
  try {
  const resolved = new URL(imgUrl, apiBase).href;
  normalized.push(resolved);
  } catch (error) {
  // ignore
  }
  }
  
  if (typeof window !== "undefined") {
  try {
  const fromWindow = new URL(imgUrl, window.location.origin).href;
  if (!normalized.includes(fromWindow)) {
  normalized.push(fromWindow);
  }
  } catch (error) {
  // ignore
  }
  }
  
  // Also include raw path as a last attempt
  normalized.push(imgUrl);
  
  return normalized;
  };
  
  export const validateImageUrl = (
  imgUrl: string | null | undefined,
  fallbackUrl: string,
  timeoutMs = 5000
  ): Promise<string> => {
  return new Promise((resolve) => {

  if (!imgUrl || imgUrl.trim() === "") {
  return resolve(fallbackUrl);
  }
  
  const candidates = normalizeImageUrl(imgUrl);
  let candidateIndex = 0;
  let isResolved = false;
  
  const tryNextUrl = (url: string) => {
  const img = new Image();
  const timer = window.setTimeout(() => {
  img.onload = null;
  img.onerror = null;
  if (!isResolved) {
  candidateIndex += 1;
  if (candidateIndex < candidates.length) {
  tryNextUrl(candidates[candidateIndex]);
  } else {
  isResolved = true;
  resolve(fallbackUrl);
  }
  }
  }, timeoutMs);
  
  img.onload = () => {
  if (!isResolved) {
  isResolved = true;
  window.clearTimeout(timer);
  resolve(url);
  }
  };
  
  img.onerror = () => {
  window.clearTimeout(timer);
  if (!isResolved) {
  candidateIndex += 1;
  if (candidateIndex < candidates.length) {
  tryNextUrl(candidates[candidateIndex]);
  } else {
  isResolved = true;
  resolve(fallbackUrl);
  }
  }
  };
  
  img.src = url;
  };
  
  if (candidates.length > 0) {
  tryNextUrl(candidates[candidateIndex]);
  } else {
  resolve(fallbackUrl);
  }
  });
  };