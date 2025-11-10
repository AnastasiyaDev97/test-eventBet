import { CLIENT_ID } from '@/shared/config/env'
import type { CasinoHttpRepository } from '../api/CasinoHttpRepository'
import type { HttpRequest } from '@/shared/api/httpClient'

export class BalanceService {
  constructor(private readonly repo: CasinoHttpRepository) {}

  async load(options?: Partial<HttpRequest>) {
    return this.repo.getBalance({ clientId: CLIENT_ID, options })
  }
}
