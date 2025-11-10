import { Token } from '@/entities/Token'

export interface AuthRepository {
  login(params: {
    login: string
    password: string
    clientId: string
    signal?: AbortSignal
  }): Promise<Token>
  refresh(params: { refreshToken: string; clientId: string; signal?: AbortSignal }): Promise<Token>
}
