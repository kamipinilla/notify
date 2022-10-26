import { GatewayService } from './gateway'
import { QueueService } from './queue'
import { Rate, TimeUnit } from './time'
import { TimelineService } from './timeline'
import { Id, Message } from './types'

export class NotificationType {
  static readonly News = new this('news', new Rate({
    amount: 1,
    coefficient: 3,
    unit: TimeUnit.Hour,
  }))
  static readonly Marketing = new this('marketing', new Rate({
    amount: 2,
    unit: TimeUnit.Day,
  }))
  static readonly Status = new this('status', new Rate({
    amount: 1,
    coefficient: 4,
    unit: TimeUnit.Second,
  }))
  static readonly Invitation = new this('invitation', new Rate({
    amount: 1,
    coefficient: 12,
    unit: TimeUnit.Second,
  }))

  private constructor(
    private id: string,
    private maxRate: Rate,
  ) {}

  getId(): string {
    return this.id
  }

  getMaxRate(): Rate {
    return this.maxRate
  }
}

export interface NotificationService {
  send(type: NotificationType, userId: Id, message: Message): void
}

export class NotificationServiceImpl implements NotificationService {
  constructor(
    private timelineService: TimelineService,
    private queueService: QueueService,
    private gatewayService: GatewayService,
    private enqueueOnReject: boolean,
  ) {}

  send(type: NotificationType, userId: Id, message: Message): void {
    const duration = type.getMaxRate().getDurationMillis()
    const periodStart = Date.now() - duration
    
    const list = this.timelineService.getTimeline(type, userId)
      .filter(instant => instant >= periodStart)

    const maxAmount = type.getMaxRate().getAmount()
    const accept = list.length < maxAmount
    if (accept) {
      this.gatewayService.send(userId, message)
      list.push(Date.now())
      this.timelineService.setTimeline(type, userId, list)
      if (this.enqueueOnReject) {
        this.scheduleQueueCheck(type, userId, duration)
      }
    } else if (this.enqueueOnReject) {
      this.queueService.enqueue(type, userId, message)
      console.log(`Enqueued <${type.getId()}> message for user "${userId}"`)
    } else {
      console.log(`Rejected <${type.getId()}> message for user "${userId}"`)
    }
  }

  private scheduleQueueCheck(type: NotificationType, userId: Id, duration: number): void {
    setTimeout(() => {
      if (!this.queueService.isEmpty(type, userId)) {
        const message = this.queueService.dequeue(type, userId)
        this.gatewayService.send(userId, message)
        this.timelineService.addToTimeline(type, userId, Date.now())
        this.scheduleQueueCheck(type, userId, duration)
      }
    }, duration)
  }
}