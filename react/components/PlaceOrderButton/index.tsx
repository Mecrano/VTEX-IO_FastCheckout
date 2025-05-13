import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import PLACE_ORDER from '../../graphql/mutation.placeOrder.gql'
import { CASH_ID, PAYMENT_TERMINAL_ID } from '../Payment'
import ModalLoading from './ModalLoading'
import DatafonoModal from './DatafonoModal'
import placeOrderWithDatafono from './datafono'
import messages from './messages'

const CSS_HANDLES = ['placeOrderContainer'] as const

const PlaceOrderButton = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()
  const { orderForm } = useOrderForm()
  const { navigate } = useRuntime()
  const [modalOpen, setModalOpen] = useState(false)
  const [datafonoModalOpen, setDatafonoModalOpen] = useState(false)
  const [placeOrder, { data, loading, error }] = useMutation(PLACE_ORDER)

  const handlePlaceOrder = useCallback(() => {
    if (!orderForm?.id || !orderForm?.value) {
      return
    }

    const [{ paymentSystem }] = orderForm?.paymentData?.payments

    if (paymentSystem === CASH_ID) {
      setModalOpen(true)
      placeOrder({
        variables: {
          orderFormId: orderForm.id,
          value: orderForm.value,
        },
      })

      return
    }

    if (paymentSystem === PAYMENT_TERMINAL_ID) {
      placeOrderWithDatafono(
        orderForm,
        () => setDatafonoModalOpen(true)
      ).catch(() => {
        alert(intl.formatMessage(messages.unexpectedError))
      })
    }
  }, [orderForm, placeOrder, intl])

  const handleDatafonoSuccess = useCallback(() => {
    setDatafonoModalOpen(false)
    setModalOpen(true)

    placeOrder({
      variables: {
        orderFormId: orderForm.id,
        value: orderForm.value,
      },
    })
  }, [orderForm, placeOrder])

  useEffect(() => {
    if (error) {
      console.error('Error updating payment:', error)
      setModalOpen(false)
      return
    }

    if (loading) {
      return
    }

    if (data?.placeOrder?.orderGroup) {
      navigate({
        to: `/checkout/orderPlaced/?og=${data.placeOrder?.orderGroup}`,
      })
    }
  }, [data, loading, error, navigate])

  return (
    <div className={handles.placeOrderContainer}>
      <Button
        variation="primary"
        onClick={handlePlaceOrder}
        disabled={
          !orderForm?.id ||
          !orderForm?.value ||
          !orderForm?.clientProfileData?.email ||
          !orderForm?.items?.length ||
          !orderForm?.paymentData?.payments?.length ||
          loading
        }
      >
        <FormattedMessage id={messages.placeOrder.id} />
      </Button>

      <ModalLoading isOpen={modalOpen} />

      {orderForm?.id && (
        <DatafonoModal
          isOpen={datafonoModalOpen}
          orderFormId={orderForm.id}
          onClose={() => setDatafonoModalOpen(false)}
          onSuccess={handleDatafonoSuccess}
        />
      )}
    </div>
  )
}

export default PlaceOrderButton
