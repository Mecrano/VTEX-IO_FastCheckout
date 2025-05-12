import React, { useEffect, useState, useCallback } from 'react'
import { SelectableCard } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMutation } from 'react-apollo'
import UPDATE_PAYMENT from 'vtex.checkout-resources/MutationUpdateOrderFormPayment'

import { Cash, Card } from '../Icons'
import messages from './messages'
import getDataFromPaymentTerminal, {
  PAYMENT_TERMINAL_ID,
} from './paymentTerminal'

const CSS_HANDLES = [
  'paymentContainer',
  'paymentSelector',
  'paymentForm',
  'paymentCash',
  'paymentCards',
  'cardSelector',
] as const

interface Payment {
  id: string
  name: string
}

const CASH_ID = '201'

const Payment = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { orderForm, setOrderForm } = useOrderForm()
  const [selected, setSelected] = useState<string | null>(null)

  const [updatePayment, { data, loading, error }] = useMutation(UPDATE_PAYMENT)

  useEffect(() => {
    if (error) {
      console.error('Error updating payment:', error)

      return
    }

    if (loading) {
      return
    }

    if (data?.updateOrderFormPayment?.id) {
      setOrderForm(data.updateOrderFormPayment)
    }
  }, [data, loading, error, setOrderForm])

  const handlePaymentUpdate = useCallback(
    async (paymentMethod: string) => {
      if (!orderForm?.paymentData) {
        return
      }

      let payment: any = null

      if (paymentMethod === 'cash') {
        payment = {
          paymentSystem: CASH_ID,
          referenceValue: orderForm.value,
          value: orderForm.value,
          installments: 1,
        }
      }

      if (paymentMethod === 'cards') {
        payment = await getDataFromPaymentTerminal(orderForm)
      }

      if (!payment) {
        return
      }

      const currentPaymentMethod =
        orderForm?.paymentData?.payments?.[0]?.paymentSystem

      if (currentPaymentMethod === payment.paymentSystem) {
        return
      }

      updatePayment({
        variables: {
          paymentData: {
            payments: [payment],
          },
        },
      })
    },
    [orderForm, updatePayment]
  )

  useEffect(() => {
    if (!orderForm?.paymentData?.payments?.length || selected) {
      return
    }

    const paymentMethod = orderForm.paymentData.payments[0].paymentSystem

    if (paymentMethod === CASH_ID) {
      setSelected('cash')
    }

    if (paymentMethod === PAYMENT_TERMINAL_ID) {
      setSelected('cards')
    }
  }, [orderForm.paymentData, selected])

  const selectPaymentMethod = (id: string) => {
    handlePaymentUpdate(id)
    setSelected(id)
  }

  return (
    <div className={handles.paymentContainer}>
      <h3 className="t-heading-3 tc c-on-base">
        {intl.formatMessage(messages.title)}
      </h3>
      <div
        className={`${handles.paymentSelector} ${handles.cardSelector} flex justify-center items-center`}
      >
        <SelectableCard
          hasGroupRigth
          noPadding
          selected={selected === 'cash'}
          onClick={() => selectPaymentMethod('cash')}
        >
          <div
            className={`${handles.paymentCash} pa7 flex items-center justify-center`}
          >
            <Cash size="50" />
            <div className="ml3 f4 tc">
              <FormattedMessage id={messages.cash.id} />
            </div>
          </div>
        </SelectableCard>
        <SelectableCard
          hasGroupLeft
          noPadding
          selected={selected === 'cards'}
          onClick={() => selectPaymentMethod('cards')}
        >
          <div
            className={`${handles.paymentCards} pa7 flex items-center justify-center`}
          >
            <Card size="50" />
            <div className="ml3 f4 tc">
              <FormattedMessage id={messages.cards.id} />
            </div>
          </div>
        </SelectableCard>
      </div>
    </div>
  )
}

export default Payment
