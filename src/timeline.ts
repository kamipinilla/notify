import { hashUserNotification } from './hash'
import { NotificationType } from './notification'
import { Id, Instant } from './types'

export interface TimelineService {
  getTimeline(type: NotificationType, userId: Id): Instant[]
  setTimeline(type: NotificationType, userId: Id, timeline: Instant[]): void
  addToTimeline(type: NotificationType, userId: Id, instant: Instant): void
}

export class TimelineServiceImpl implements TimelineService {
  private timelineMap: Map<string, Instant[]>

  constructor() {
    this.timelineMap = new Map()
  }

  getTimeline(type: NotificationType, userId: Id): Instant[] {
    return this.findTimeline(type, userId, true)
  }

  setTimeline(type: NotificationType, userId: Id, timeline: Instant[]): void {
    const hash = hashUserNotification(type, userId)
    this.timelineMap.set(hash, timeline)
  }

  addToTimeline(type: NotificationType, userId: Id, instant: Instant): void {
    const timeline = this.findTimeline(type, userId, true)
    timeline.push(instant)
  }

  private findTimeline(type: NotificationType, userId: Id, create = false): Instant[] {
    const hash = hashUserNotification(type, userId)
    if (!this.timelineMap.has(hash)) {
      if (create) {
        this.timelineMap.set(hash, [])
      } else {
        throw Error(`Timeline not found: ${hash}`)
      }
    }
    return this.timelineMap.get(hash)!
  }
}
