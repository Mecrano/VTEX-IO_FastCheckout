import type { ParamsContext, RecorderState, ServiceContext } from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { placeOrder } from './resolvers/orders'

const MEDIUM_TIMEOUT_MS = 60 * 1000

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>
}

// Export a service that defines resolvers and clients' options
export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        timeout: MEDIUM_TIMEOUT_MS,
      },
      events: {
        exponentialTimeoutCoefficient: 5,
        exponentialBackoffCoefficient: 5,
        initialBackoffDelay: 100,
      },
    },
  },
  graphql: {
    resolvers: {
      Query: {},
      Mutation: {
        placeOrder,
      },
    },
  },
})
