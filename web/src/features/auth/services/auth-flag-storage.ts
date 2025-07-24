import {
  getLocalStorageItem,
  LOCAL_STORAGE_KEYS,
  setLocalStorageItem,
} from "@/services/local-storage"

// Store a flag indicating potential authentication state
export function setShouldBeAuthenticated(shouldBeAuthenticated: boolean) {
  if (shouldBeAuthenticated) {
    setLocalStorageItem(
      LOCAL_STORAGE_KEYS.shouldBeAuthenticated,
      shouldBeAuthenticated,
    )
    return
  }
  localStorage.removeItem(LOCAL_STORAGE_KEYS.shouldBeAuthenticated)
}

// Get the flag indicating potential authentication state
export function shouldBeAuthenticated() {
  return getLocalStorageItem<boolean>(
    LOCAL_STORAGE_KEYS.shouldBeAuthenticated,
    false,
  )
}
