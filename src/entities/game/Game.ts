export class Game {
  constructor(
    public id: string,
    public title: string,
    public image: string,
  ) {}
}

export class OpenGameLink {
  constructor(public readonly url: string) {
    if (!url) throw new Error('Game URL is empty')
  }
}
