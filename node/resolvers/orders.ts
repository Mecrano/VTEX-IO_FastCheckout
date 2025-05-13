export const placeOrder = async (
  _: any,
  { orderFormId, value }: { orderFormId: string; value: number },
  { clients: { oms: orderClient } }: Context
) => {
  try {
    const cookie = []

    // 1. Place the order
    const {
      data: order,
      headers: orderHeaders,
    }: any = await orderClient.placeOrder(orderFormId, value)

    if (!order?.orderGroup) {
      throw new Error(JSON.stringify(order?.messages, null, 2))
    }

    cookie.push(
      ...(orderHeaders?.['set-cookie'] ?? []).filter(
        (c: string) =>
          c.includes('Vtex_CHKO_Auth') || c.includes('CheckoutDataAccess')
      )
    )

    // 2. Send payment information
    await orderClient.sendPaymentInformation(order)

    // 3. Request order processing
    await orderClient.requestOrderProcessing(
      order.orderGroup,
      cookie.join('; ')
    )

    return { orderGroup: order.orderGroup }
  } catch (error) {
    // Handle error
    console.error('Error placing order:', error)
    console.error('Error placing order2:', JSON.stringify(error))
    throw error
  }
}
