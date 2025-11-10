import { CLIENT_ID } from '@/shared/config/env'
import type { CasinoHttpRepository } from '../api/CasinoHttpRepository'
import type { HttpRequest } from '@/shared/api/httpClient'

export class GameService {
  constructor(private readonly repo: CasinoHttpRepository) {}

  async listGames(page: number, perPage: number, options: Partial<HttpRequest>) {
    return this.repo.getGames({ clientId: CLIENT_ID, page, perPage, options })
  }

  async open(gameId: string, currency: string, options?: Partial<HttpRequest>) {
    return await this.repo.openGameSession({ gameId, clientId: CLIENT_ID, currency, options })
  }
}
