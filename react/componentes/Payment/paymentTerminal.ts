const getDataFromPaymentTerminal = async (orderForm: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        paymentSystem: '6',
        referenceValue: orderForm.value,
        value: orderForm.value,
        installments: 1,
      })
    }, 10000)
  })
}

export default getDataFromPaymentTerminal
