export const PAYMENT_TERMINAL_ID = '202'

const getDataFromPaymentTerminal = async (orderForm: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        paymentSystem: '202',
        referenceValue: orderForm.value,
        value: orderForm.value,
        installments: 1,
      })
    }, 10000)
  })
}

export default getDataFromPaymentTerminal
