export const LOCAL_STORAGE_KEYS = {
  shouldBeAuthenticated: "codifeed.auth.should_be_authenticated",
  theme: "codifeed.ui.theme",
}

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key)
  if (item) {
    return JSON.parse(item) as T
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
