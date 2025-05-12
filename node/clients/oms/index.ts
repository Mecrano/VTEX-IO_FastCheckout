import { InstanceOptions, IOContext, IOResponse, JanusClient } from '@vtex/api'

export class OMSClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
      },
    })
  }

  public placeOrder = async (
    orderFormId: string,
    value: number
  ): Promise<IOResponse<any>> => {
    return this.http.postRaw(
      `/api/checkout/pub/orderForm/${orderFormId}/transaction`,
      {
        referenceId: orderFormId,
        savePersonalData: true,
        optinNewsLetter: true,
        value,
        referenceValue: value,
        interestValue: 0,
      }
    )
  }

  public sendPaymentInformation = async ({
    merchantTransactions,
    orderGroup,
    storePreferencesData,
    paymentData,
  }: any): Promise<IOResponse<any>> => {
    const [{ transactionId, merchantName, payments }] = merchantTransactions
    const [{ paymentSystem, value, referenceValue }] = payments

    const [{ installments, merchantSellerPayments }] = paymentData?.payments
    const [{ interestRate }] = merchantSellerPayments

    const { currencyCode } = storePreferencesData

    return this.http.post(
      `https://${this.context.account}.vtexpayments.com.br/api/pub/transactions/${transactionId}/payments?orderId=${orderGroup}-01`,
      [
        {
          paymentSystem,
          installments,
          currencyCode,
          value,
          installmentsInterestRate: interestRate,
          installmentsValue: value,
          referenceValue,
          transaction: {
            id: transactionId,
            merchantName,
          },
        },
      ]
    )
  }

  public requestOrderProcessing = async (
    orderGroup: string,
    cookie: string
  ): Promise<IOResponse<any>> => {
    return this.http.post(
      `/api/checkout/pub/gatewayCallback/${orderGroup}`,
      {},
      {
        metric: 'oms-requestOrderProcessing',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Cookie: cookie,
        },
      }
    )
  }
}
