import { NotificationType } from './notification'
import { Id } from './types'

export function hashUserNotification(type: NotificationType, userId: Id): string {
  return `${type.getId()}-${userId}`
}