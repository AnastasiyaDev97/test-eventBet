import { authService, tokenManager } from '@/app/providers/container'
import { HttpError, type HttpRequest } from './httpClient'
import { http } from './httpClient'

export async function httpAuth<T>(req: HttpRequest): Promise<T> {
  let access = tokenManager.getAccessToken()

  const makeRequest = () =>
    http<T>({
      ...req,
      query: {
        ...(req.query ?? {}),
        ...(access ? { auth: access } : {}),
      },
    })

  try {
    return await makeRequest()
  } catch (err) {
    if (!(err instanceof HttpError)) throw err
    if (err.status !== 401) throw err

    const refresh = tokenManager.getRefreshToken()
    if (!refresh) {
      authService.logout()
      throw err
    }

    try {
      await authService.refresh()
    } catch {
      authService.logout()
      throw err
    }

    access = tokenManager.getAccessToken()

    return await makeRequest()
  }
}
