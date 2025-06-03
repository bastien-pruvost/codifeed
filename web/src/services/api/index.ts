import createClient from 'openapi-fetch'
import type { paths } from '@/types/api.gen'

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  credentials: 'include',
})
