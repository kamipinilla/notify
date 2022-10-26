import { NotificationType } from './src/notification'
import { TimeUnit } from './src/time'
import { Scenario } from './test/scenario'
import { Duration } from './test/time'

function getScenario1(): Scenario {
  const userId = 'u1'
  return new Scenario({
    enqueueOnReject: true,
    events: [
      {
        userId,
        type: NotificationType.Invitation,
        message: 'invitation1',
        delta: new Duration(1, TimeUnit.Second),
      },
      {
        userId,
        type: NotificationType.Status,
        message: 'status1',
        delta: new Duration(2, TimeUnit.Second),
      },
      {
        userId,
        type: NotificationType.Status,
        message: 'status2',
        delta: new Duration(3, TimeUnit.Second),
      },
      {
        userId,
        type: NotificationType.Invitation,
        message: 'invitation2',
        delta: new Duration(3, TimeUnit.Second),
      },
      {
        userId,
        type: NotificationType.Status,
        message: 'status3',
        delta: new Duration(6, TimeUnit.Second),
      },
      {
        userId,
        type: NotificationType.Status,
        message: 'status4',
        delta: new Duration(1, TimeUnit.Second),
      },
      {
        userId,
        type: NotificationType.Status,
        message: 'status5',
        delta: new Duration(1, TimeUnit.Second),
      },
    ],
  })
}

function main() {
  getScenario1().run()
}

main()