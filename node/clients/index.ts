import { IOClients } from '@vtex/api'

import { OMSClient } from './oms'

export class Clients extends IOClients {
  public get oms() {
    return this.getOrSet('oms', OMSClient)
  }
}
