import {
  getLocalStorageItem,
  setLocalStorageItem,
  LOCAL_STORAGE_KEYS,
} from "@/services/local-storage"

export function getStoredUserId() {
  return getLocalStorageItem<string | null>(LOCAL_STORAGE_KEYS.userId, null)
}

export function setStoredUserId(userId: string | null) {
  setLocalStorageItem(LOCAL_STORAGE_KEYS.userId, userId)
}
