import { type CasinoRepository } from './CasinoRepository'
import { API_BASE } from '@/shared/config/env'
import { Game, OpenGameLink } from '@/entities/game/Game'
import { Balance } from '@/entities/balance/Balance'
import { Money } from '@/entities/balance/Money'
import { httpAuth } from '@/shared/api/httpAuthClient'
import type { HttpRequest } from '@/shared/api/httpClient'

export interface BalanceFromRequest {
  available: number
  bonus: number
  currency: string
}

interface BalanceResponse {
  id: string
  attributes: BalanceFromRequest
}

interface GamesResponse {
  id: string
  attributes: GameResponseItem
}

interface OpenGamesResponse {
  data: {
    attributes: {
      'launch-options': { 'game-url'?: string }
    }
  }[]
}

interface GameResponseItem {
  title?: string
  image?: string
}

export interface GamesResult {
  list: Game[]
  page: number
  pageCount: number
  total: number
}

export class CasinoHttpRepository implements CasinoRepository {
  async getBalance(params: {
    clientId: string
    options?: Partial<HttpRequest>
  }): Promise<Balance[]> {
    const { data } = await httpAuth<{ data: BalanceResponse[] }>({
      url: `${API_BASE}/v2/users/me/balance`,
      query: { clientId: params.clientId },
      ...params.options,
    })

    return data.map(
      ({ attributes }) =>
        new Balance(
          new Money(attributes.available, attributes.currency),
          new Money(attributes.bonus, attributes.currency),
        ),
    )
  }

  async getGames(params: {
    clientId: string
    page: number
    perPage: number
    options: Partial<HttpRequest>
  }): Promise<GamesResult> {
    const res = await httpAuth<{
      data: GamesResponse[]
      meta: {
        ['current-page']: number
        ['page-count']: number
        ['total-count']: number
        ['per-page']: number
      }
    }>({
      url: `${API_BASE}/v2/casino/games`,
      query: {
        clientId: params.clientId,
        page: params.page,
        'per-page': params.perPage,
      },
      ...params.options,
    })

    const list = res.data.map((item) => {
      const attr = item.attributes ?? {}
      return new Game(String(item.id), attr.title ?? 'Game', attr.image ?? '')
    })

    return {
      list,
      page: res.meta['current-page'],
      pageCount: res.meta['page-count'],
      total: res.meta['total-count'],
    }
  }

  async openGameSession(params: {
    gameId: string
    clientId: string
    currency: string
    options?: Partial<HttpRequest>
  }): Promise<OpenGameLink> {
    const { data } = await httpAuth<OpenGamesResponse>({
      url: `${API_BASE}/v2/casino/games/${params.gameId}/session`,
      method: 'POST',
      query: { clientId: params.clientId },
      body: { clientId: params.clientId, currency: params.currency },
      ...params.options,
    })

    const url = data?.[0]?.attributes['launch-options']['game-url'] ?? ''

    return new OpenGameLink(url)
  }
}
