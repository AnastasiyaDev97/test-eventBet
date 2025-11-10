export class BalancePoller {
  private intervalId: number | null = null

  constructor(
    private readonly loadFn: () => Promise<void>,
    private readonly ms: number,
  ) {}

  start() {
    this.stop()
    this.loadFn()
    this.intervalId = setInterval(this.loadFn, this.ms)
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = null
  }
}
