import { api } from '@/services/api'
import type { paths } from '@/types/api.gen'

export function userQueryOptions(
  userId: paths['/users/{user_id}']['get']['parameters']['path']['user_id'],
) {
  return {
    queryKey: ['user', userId],
    queryFn: () =>
      api.GET('/users/{user_id}', { params: { path: { user_id: userId } } }),
  }
}
