import React, { useState } from 'react'
import { SelectableCard } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { Cash, Card } from '../Icons'
import messages from './messages'

const CSS_HANDLES = [
  'paymentContainer',
  'paymentSelector',
  'paymentForm',
  'paymentCash',
  'paymentCards',
] as const

const Payment = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className={handles.paymentContainer}>
      <h3 className="t-heading-3 tc">{intl.formatMessage(messages.title)}</h3>
      <div
        className={`${handles.paymentSelector} flex justify-center items-center`}
      >
        <SelectableCard
          hasGroupRigth
          hasGroupLeft
          noPadding
          selected={selected === 'legal'}
          onClick={() => setSelected('legal')}
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
          selected={selected === 'natural'}
          onClick={() => setSelected('natural')}
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
