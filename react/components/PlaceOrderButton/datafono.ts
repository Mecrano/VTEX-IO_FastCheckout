interface OrderForm {
  id: string
  value: number
  items: any[]
  paymentData: {
    payments: Array<{
      paymentSystem: string
      value: number
    }>
  }
  [key: string]: any
}

/**
 * Realiza el proceso de pago con datáfono
 * @param orderForm Formulario de pedido actual
 * @param onOpenModal Callback para abrir el modal de pago
 * @returns Promise que se resuelve cuando se completa el proceso
 */
const placeOrderWithDatafono = async (
  orderForm: OrderForm,
  onOpenModal: (orderFormId: string) => void
): Promise<void> => {
  try {
    // Validar que el orderForm tenga la información necesaria
    if (!orderForm?.id || !orderForm?.value || !orderForm?.paymentData?.payments?.length) {
      throw new Error('Información del pedido incompleta')
    }

    // Abrir el modal para iniciar el proceso de pago
    onOpenModal(orderForm.id)

    // Registrar información para debugging
    console.log('Procesando pago con Datáfono:', {
      orderFormId: orderForm.id,
      value: orderForm.value,
      paymentSystem: orderForm.paymentData.payments[0].paymentSystem,
    })
  } catch (error) {
    console.error('Error procesando pago con datáfono:', error)
    throw error
  }
}

export default placeOrderWithDatafono
