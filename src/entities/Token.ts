export class Token {
  constructor(
    public readonly access: string,
    public readonly refresh: string,
  ) {
    if (!access) throw new Error('Token.access is required')
    if (!refresh) throw new Error('Token.refresh is required')
  }
}
