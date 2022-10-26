import { hashUserNotification } from './hash'
import { NotificationType } from './notification'
import { Id, Message } from './types'

export interface QueueService {
  enqueue(type: NotificationType, userId: Id, message: Message): void
  isEmpty(type: NotificationType, userId: Id): boolean
  dequeue(type: NotificationType, userId: Id): Message
}

export class QueueServiceImpl implements QueueService {
  private queueMap: Map<string, Message[]>

  constructor() {
    this.queueMap = new Map()
  }

  enqueue(type: NotificationType, userId: Id, message: Message): void {
    const queue = this.findQueue(type, userId, true)
    queue.push(message)
  }

  isEmpty(type: NotificationType, userId: Id): boolean {
    return !this.queueExists(type, userId) || this.findQueue(type, userId).length === 0
  }

  dequeue(type: NotificationType, userId: Id): Message {
    const queue = this.findQueue(type, userId)
    const message = queue.shift()
    if (message === undefined) {
      throw Error(`No queued <${type.getId()}> messages for user ${userId}`)
    }
    return message
  }

  private queueExists(type: NotificationType, userId: Id): boolean {
    const hash = hashUserNotification(type, userId)
    return this.queueMap.has(hash)
  }

  private findQueue(type: NotificationType, userId: Id, create = false): Message[] {
    const hash = hashUserNotification(type, userId)
    if (!this.queueMap.has(hash)) {
      if (create) {
        this.queueMap.set(hash, [])
      } else {
        throw Error(`Message queue not found: ${hash}`)
      }
    }
    return this.queueMap.get(hash)!
  }
}