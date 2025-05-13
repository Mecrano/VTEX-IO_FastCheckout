import { defineMessages } from 'react-intl'

const messages = defineMessages({
  placeOrder: {
    id: 'store/fast-checkout.buttons.place-order',
  },
  loadingOrder: {
    id: 'store/checkout.loadingOrder',
    defaultMessage: 'Procesando pedido',
  },
  datafonoModalTitle: {
    id: 'store/checkout.datafonoModalTitle',
    defaultMessage: 'Realiza tu pago a través de nuestro datáfono',
  },
  datafonoModalAlert: {
    id: 'store/checkout.datafonoModalAlert',
    defaultMessage: '⚠️ Atención: Hay una transacción en proceso. Por favor, finalízala para continuar. Si no deseas continuar la operación, por favor, presiona el botón cancelar.',
  },
  cancelTransaction: {
    id: 'store/checkout.cancelTransaction',
    defaultMessage: 'Cancelar transacción',
  },
  transactionFailed: {
    id: 'store/checkout.transactionFailed',
    defaultMessage: 'La validación de la transacción falló.',
  },
  transactionCanceled: {
    id: 'store/checkout.transactionCanceled',
    defaultMessage: 'Transacción cancelada por el operador.',
  },
  unknownStatus: {
    id: 'store/checkout.unknownStatus',
    defaultMessage: 'Estado de transacción no reconocido:',
  },
  unexpectedError: {
    id: 'store/checkout.unexpectedError',
    defaultMessage: 'Ha ocurrido un error inesperado. Por favor, intente nuevamente.',
  },
})

export default messages
