import { AuthHttpRepository } from '@/features/auth/api/AuthHttpRepository'
import { AuthService } from '@/features/auth/service/AuthService'
import { TokenManager } from '@/shared/lib/token/TokenManager'
import { CasinoHttpRepository } from '@/features/casino/api/CasinoHttpRepository'
import { LocalStorageDriver } from '@/shared/lib/storage/LocalStorageDriver'
import { BalanceService } from '@/features/casino/service/BalanceService'
import { CasinoFacade } from './casino/CasinoFacade'
import { GameService } from '@/features/casino/service/GameService'

export const tokenManager = new TokenManager(new LocalStorageDriver())

export const authService = new AuthService(new AuthHttpRepository(), tokenManager)

export const balanceService = new BalanceService(new CasinoHttpRepository())
export const gameService = new GameService(new CasinoHttpRepository())

export const casinoFacade = new CasinoFacade(gameService, balanceService)
