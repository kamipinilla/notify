import { TimeUnit } from '../src/time'

export class Duration {
  constructor(
    private amount: number,
    private unit: TimeUnit,
  ) {}

  getMillis(): number {
    return this.amount * this.unit.getMillisDuration()
  }
}
