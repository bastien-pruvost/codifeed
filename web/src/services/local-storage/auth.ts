import {
  getLocalStorageItem,
  setLocalStorageItem,
  LOCAL_STORAGE_KEYS,
} from "@/services/local-storage"

// Store a flag indicating potential authentication state
export function setShouldCheckAuth(isAuthenticated: boolean) {
  if (isAuthenticated) {
    setLocalStorageItem(LOCAL_STORAGE_KEYS.shouldCheckAuth, isAuthenticated)
    return
  }
  localStorage.removeItem(LOCAL_STORAGE_KEYS.shouldCheckAuth)
}

// Get the flag indicating potential authentication state
export function shouldCheckAuth() {
  return getLocalStorageItem<boolean>(LOCAL_STORAGE_KEYS.shouldCheckAuth, false)
}
