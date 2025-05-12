import React, { useEffect, useState, useCallback } from 'react'
import { SelectableCard } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMutation } from 'react-apollo'
import UPDATE_PAYMENT from 'vtex.checkout-resources/MutationUpdateOrderFormPayment'

import { Cash, Card } from '../Icons'
import messages from './messages'
import getDataFromPaymentTerminal from './paymentTerminal'

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

const Payment = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { orderForm } = useOrderForm()
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
      // eslint-disable-next-line no-console
      console.log('Payment updated successfully:', data.updateOrderFormPayment)
    }
  }, [data, loading, error])

  const handlePaymentUpdate = useCallback(
    async (paymentMethod: string) => {
      if (!orderForm) {
        return
      }

      let payment = null

      if (paymentMethod === 'cash') {
        payment = {
          paymentSystem: '201',
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

      updatePayment({
        variables: {
          payments: [payment],
        },
      })
    },
    [updatePayment, orderForm]
  )

  useEffect(() => {
    if (selected) {
      handlePaymentUpdate(selected)
    }
  }, [handlePaymentUpdate, selected])

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
          hasGroupLeft
          noPadding
          selected={selected === 'cash'}
          onClick={() => setSelected('cash')}
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
          hasGroupRigth
          hasGroupLeft
          noPadding
          selected={selected === 'cards'}
          onClick={() => setSelected('cards')}
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
