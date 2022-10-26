export class TimeUnit {
  static readonly Second = new this(1e3)
  static readonly Minute = new this(6e4)
  static readonly Hour = new this(36e5)
  static readonly Day = new this(864e5)

  private constructor(
    private millisDuration: number
  ) {}

  getMillisDuration(): number {
    return this.millisDuration
  }
}

export class Rate {
  private amount: number
  private coefficient: number
  private unit: TimeUnit

  constructor(params: {
    amount: number
    coefficient?: number
    unit: TimeUnit
  }) {
    this.amount = params.amount
    this.coefficient = params.coefficient ?? 1
    this.unit = params.unit
  }

  getAmount(): number {
    return this.amount
  }

  getDurationMillis(): number {
    return this.coefficient * this.unit.getMillisDuration()
  }
}
