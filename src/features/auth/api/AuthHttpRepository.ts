import { type AuthRepository } from './AuthRepository'
import { API_BASE } from '@/shared/config/env'
import { Token } from '@/entities/Token'
import { httpAuth } from '@/shared/api/httpAuthClient'

interface LoginApiResponse {
  attributes: RefreshResponse
}

interface RefreshResponse {
  token: string
  'refresh-token': string
}

export class AuthHttpRepository implements AuthRepository {
  async login(params: {
    login: string
    password: string
    clientId: string
    signal?: AbortSignal
    credentials?: RequestCredentials
  }): Promise<Token> {
    const { login, password, clientId, signal } = params

    const { data } = await this.request(
      httpAuth<{ data: LoginApiResponse[] }>({
        url: `${API_BASE}/v2/login`,
        method: 'POST',
        query: { clientId },
        body: { clientId, login, password },
        signal,
      }),
      'login',
    )

    return this.mapToken(data)
  }

  async refresh(params: {
    refreshToken: string
    clientId: string
    signal?: AbortSignal
  }): Promise<Token> {
    const { refreshToken, clientId, signal } = params

    const data = await this.request(
      httpAuth<RefreshResponse>({
        url: `${API_BASE}/auth/token`,
        method: 'POST',
        query: { clientId },
        body: { clientId, refreshToken },
        signal,
      }),
      'refresh',
    )

    return new Token(data.token, data['refresh-token'] ?? '')
  }

  private mapToken(data: LoginApiResponse[]): Token {
    if (!data || data?.length === 0) {
      throw new Error('No login data received')
    }

    const firstItem = data[0]
    if (!firstItem?.attributes) {
      throw new Error('Invalid login response structure')
    }
    const { attributes } = firstItem

    return new Token(attributes.token, attributes['refresh-token'] ?? '')
  }

  private async request<T>(httpCall: Promise<T>, action: string): Promise<T> {
    try {
      return await httpCall
    } catch (err) {
      throw new Error(`Auth API ${action} failed: ${err instanceof Error ? err.message : err}`)
    }
  }
}
