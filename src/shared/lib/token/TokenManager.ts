import { authStore } from '@/features/auth/model/authStore'
import type { StorageDriver } from '../storage/StorageDriver'

export class TokenManager {
  private store = authStore

  constructor(private storage: StorageDriver) {
    const access = storage.get('access')
    const refresh = storage.get('refresh')
    if (access && refresh) {
      this.store.setToken({ access, refresh })
    }
  }

  getAccessToken(): string | null {
    return this.store.state.token?.access ?? this.storage.get('access')
  }

  getRefreshToken(): string | null {
    return this.store.state.token?.refresh ?? this.storage.get('refresh')
  }

  setToken(access: string, refresh: string) {
    this.store.setToken({ access, refresh })
    this.storage.set('access', access)
    this.storage.set('refresh', refresh)
  }

  clear() {
    this.store.clear()
    this.storage.remove('access')
    this.storage.remove('refresh')
  }

  init() {
    const access = this.storage.get('access')
    const refresh = this.storage.get('refresh')
    if (access && refresh) {
      this.store.setToken({ access, refresh })
    }
  }
}
