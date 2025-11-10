import { type AuthRepository } from '../api/AuthRepository'
import { CLIENT_ID, TOKEN_REFRESH_MS } from '@/shared/config/env'
import type { TokenManager } from '@/shared/lib/token/TokenManager'

export class AuthService {
  private refreshStopper: (() => void) | null = null
  private isRefreshing = false

  constructor(
    private readonly repo: AuthRepository,
    private readonly tokens: TokenManager,
  ) {}

  async login(login: string, password: string, signal?: AbortSignal): Promise<void> {
    const token = await this.repo.login({ login, password, clientId: CLIENT_ID, signal })

    this.tokens.setToken(token.access, token.refresh)
    this.startAutoRefresh()
  }

  logout(): void {
    this.tokens.clear()
    this.stopAutoRefresh()
  }

  public async refresh(signal?: AbortSignal): Promise<void> {
    return this.safeRefresh(signal)
  }

  private startAutoRefresh() {
    this.stopAutoRefresh()
    const intervalId = setInterval(() => this.safeRefresh(), TOKEN_REFRESH_MS)
    this.refreshStopper = () => clearInterval(intervalId)
  }

  private stopAutoRefresh() {
    this.refreshStopper?.()
    this.refreshStopper = null
  }

  private async safeRefresh(signal?: AbortSignal): Promise<void> {
    if (this.isRefreshing) return

    const refresh = this.tokens.getRefreshToken()

    if (!refresh) return

    this.isRefreshing = true
    try {
      const next = await this.repo.refresh({
        refreshToken: refresh,
        clientId: CLIENT_ID,
        signal,
      })
      this.tokens.setToken(next.access, next.refresh)
    } catch (err) {
      console.error('Token refresh failed', err)
      this.logout()
    } finally {
      this.isRefreshing = false
    }
  }
}
