import { Id, Message } from './types'

export interface GatewayService {
  send(userId: Id, message: Message): void
}

export class GatewayServiceImpl implements GatewayService {
  send(userId: Id, message: Message): void {
    console.log(`Sent "${message}" to user "${userId}"`)
  }
}