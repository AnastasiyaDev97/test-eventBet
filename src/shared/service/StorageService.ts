import type { LocalStorageDriver } from '../lib/storage/LocalStorageDriver'

export class StorageService {
  private adapter: LocalStorageDriver

  constructor(adapter: LocalStorageDriver) {
    this.adapter = adapter
  }

  get<T>(key: string): T | null {
    const raw = this.adapter.get(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T) {
    this.adapter.set(key, JSON.stringify(value))
  }

  remove(key: string) {
    this.adapter.remove(key)
  }
}
