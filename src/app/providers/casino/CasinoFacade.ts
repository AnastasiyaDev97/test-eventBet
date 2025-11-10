import { useBalanceStore } from '@/features/casino/model/balanceStore'
import { BalancePoller } from '@/features/casino/service/BalancePoller'
import type { BalanceService } from '@/features/casino/service/BalanceService'
import type { GameService } from '@/features/casino/service/GameService'
import type { HttpRequest } from '@/shared/api/httpClient'
import { BALANCE_POLL_MS } from '@/shared/config/env'

export class CasinoFacade {
  private poller: BalancePoller

  constructor(
    private readonly games: GameService,
    private readonly balance: BalanceService,
  ) {
    const store = useBalanceStore()
    this.poller = new BalancePoller(async () => {
      const bal = await this.balance.load()
      store.set(bal)
    }, BALANCE_POLL_MS)
  }

  startBalancePolling() {
    this.poller.start()
  }

  stopBalancePolling() {
    this.poller.stop()
  }

  listGames(page: number, perPage: number, options:Partial<HttpRequest>) {
    return this.games.listGames(page, perPage, options)
  }

  openGame(id: string, currency: string) {
    return this.games.open(id, currency)
  }
}
