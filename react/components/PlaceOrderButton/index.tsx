import React from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import messages from './messages'

const CSS_HANDLES = ['placeOrderContainer'] as const

const PlaceOrderButton = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const placeOrder = () => {
    // eslint-disable-next-line no-alert
    alert('Order placed!')
  }

  return (
    <div className={handles.placeOrderContainer}>
      <Button variation="primary" onClick={placeOrder}>
        <FormattedMessage id={messages.placeOrder.id} />
      </Button>
    </div>
  )
}

export default PlaceOrderButton
