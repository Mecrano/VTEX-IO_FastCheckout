import React, { useState } from 'react'
import { NumericStepper } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import messages from './messages'

const CSS_HANDLES = ['bagsContainer'] as const

const Bags = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const [quantity, setQuantity] = useState(0)

  return (
    <div className={`${handles.bagsContainer} flex flex-column items-center`}>
      <h3 className="t-heading-3 tc c-on-base">
        {intl.formatMessage(messages.title)}
      </h3>
      <div className="flex flex-row justify-center items-center">
        <NumericStepper
          size="large"
          value={quantity}
          onChange={(event: { value: React.SetStateAction<number> }) =>
            setQuantity(event.value)
          }
        />
      </div>
    </div>
  )
}

export default Bags
