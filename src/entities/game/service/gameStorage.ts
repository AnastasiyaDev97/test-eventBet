import { storageService } from '@/shared/service'
import { Game } from '../Game'

class GameStorageService {
  private prefix = 'game_'

  save(game: Game) {
    storageService.set(this.prefix + game.id, game)
  }

  load(id: string): Game | null {
    const data = storageService.get<any>(this.prefix + id)
    if (!data) return null

    return new Game(data.id, data.title, data.image)
  }

  remove(id: string) {
    storageService.remove(this.prefix + id)
  }
}

export const gameStorageService = new GameStorageService()
