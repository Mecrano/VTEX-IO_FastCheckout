import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import PLACE_ORDER from '../../graphql/mutation.placeOrder.gql'
import ModalLoading from './ModalLoading'
import messages from './messages'

const CSS_HANDLES = ['placeOrderContainer'] as const

const PlaceOrderButton = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const { orderForm } = useOrderForm()
  const { navigate } = useRuntime()
  const [modalOpen, setModalOpen] = useState(false)
  const [placeOrder, { data, loading, error }] = useMutation(PLACE_ORDER)

  const handlePlaceOrder = useCallback(() => {
    setModalOpen(true)
    placeOrder({
      variables: {
        orderFormId: orderForm.id,
        value: orderForm.value,
      },
    })
  }, [orderForm?.id, orderForm?.value, placeOrder])

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
    </div>
  )
}

export default PlaceOrderButton
