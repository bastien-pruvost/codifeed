export const LOCAL_STORAGE_KEYS = {
  userId: "codifeed.auth.user_id",
}

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key)
  if (item) {
    return JSON.parse(item)
  }
  return defaultValue
}

export function setLocalStorageItem<T>(key: string, value: T) {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.removeItem(key)
  }
}
