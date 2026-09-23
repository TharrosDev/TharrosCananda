// Private browsing and blocked storage throw on access; persistence is a convenience only.
type StorageArea = "local" | "session";
// Accessing either area can throw (blocked cookies, private modes), so every call is guarded.
const storage = (area: StorageArea) =>
  area === "session" ? globalThis.sessionStorage : globalThis.localStorage;

export function readStorage(key: string, area: StorageArea = "local") {
  try {
    return storage(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, area: StorageArea = "local") {
  try {
    storage(area)?.setItem(key, value);
  } catch {
    // Persistence is a convenience only.
  }
}

export function removeStorage(key: string, area: StorageArea = "local") {
  try {
    storage(area)?.removeItem(key);
  } catch {
    // Persistence is a convenience only.
  }
}
