import { GatewayServiceImpl } from '../src/gateway'
import { NotificationService, NotificationServiceImpl, NotificationType } from '../src/notification'
import { QueueServiceImpl } from '../src/queue'
import { TimelineServiceImpl } from '../src/timeline'
import { Id, Message } from '../src/types'
import { Duration } from './time'

type Event = {
  type: NotificationType
  userId: Id
  message: Message
  delta: Duration
}

export class Scenario {
  private enqueueOnReject: boolean
  private events: Event[]

  constructor(params: {
    enqueueOnReject: boolean,
    events: Event[],
  }) {
    this.enqueueOnReject = params.enqueueOnReject
    this.events = params.events
  }

  private getNotificationService(): NotificationService {
    return new NotificationServiceImpl(
      new TimelineServiceImpl(),
      new QueueServiceImpl(),
      new GatewayServiceImpl(),
      this.enqueueOnReject,
    )
  }

  run(): void {
    const notificationService = this.getNotificationService()
    let instant = 0
    for (const event of this.events) {
      const { type, userId, message, delta } = event
      instant += delta.getMillis()
      setTimeout(() => {
        notificationService.send(type, userId, message)
      }, instant)
    }
  }
}