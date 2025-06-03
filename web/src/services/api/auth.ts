import { api } from '@/services/api'
import type { paths } from '@/types/api.gen'

export function loginMutationOptions(
  body: paths['/auth/login']['post']['requestBody']['content']['application/json'],
) {
  return {
    mutationKey: ['login'],
    mutationFn: () => api.POST('/auth/login', { body }),
  }
}

export function registerMutationOptions(
  body: paths['/auth/register']['post']['requestBody']['content']['application/json'],
) {
  return {
    mutationKey: ['register'],
    mutationFn: () => api.POST('/auth/register', { body }),
  }
}
