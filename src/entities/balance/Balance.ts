import { Money } from './Money'

export class Balance {
  constructor(
    public readonly available: Money,
    public readonly bonus: Money,
  ) {}
}
