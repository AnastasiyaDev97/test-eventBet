import type { Balance } from '@/entities/balance/Balance'
import { OpenGameLink } from '@/entities/game/Game'
import type { HttpRequest } from '@/shared/api/httpClient'
import type { GamesResult } from './CasinoHttpRepository'

export interface CasinoRepository {
  getBalance(params: {
    token: string
    clientId: string
    options?: Partial<HttpRequest>
  }): Promise<Balance[]>
  getGames(params: {
    clientId: string
    page: number
    perPage: number
    options?: Partial<HttpRequest>
  }): Promise<GamesResult>
  openGameSession(params: {
    gameId: string
    token: string
    clientId: string
    currency: string
    options?: Partial<HttpRequest>
  }): Promise<OpenGameLink>
}
