import React, { useEffect, useState } from 'react'
import { NumericStepper } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMutation } from 'react-apollo'

import UPDATE_CUSTOM_DATA from '../../graphql/mutation.setOrderFormCustomData.gql'
import messages from './messages'

const CSS_HANDLES = ['bagsContainer', 'title'] as const

const Bags = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { orderForm, loading } = useOrderForm()
  const [quantity, setQuantity] = useState(0)

  const [updateCustomData] = useMutation(UPDATE_CUSTOM_DATA)

  useEffect(() => {
    if (orderForm?.customData && !loading) {
      const customDataFastCheckout = orderForm?.customData?.customApps?.find(
        ({ id }: any) => id === 'fast-checkout'
      )

      if (customDataFastCheckout?.fields?.bags) {
        setQuantity(Number.parseInt(customDataFastCheckout?.fields?.bags, 10))
      }
    }
  }, [orderForm?.customData, loading])

  useEffect(() => {
    // Debounce function
    const debounce = (func: (...args: any[]) => void, delay: number) => {
      let timeoutId: ReturnType<typeof setTimeout>

      return (...args: any[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func(...args)
        }, delay)
      }
    }

    const debouncedUpdate = debounce(() => {
      if (quantity !== undefined) {
        updateCustomData({
          variables: {
            appId: 'fast-checkout',
            field: 'bags',
            value: quantity.toString(),
          },
        })
      }
    }, 1000)

    debouncedUpdate()

    return () => {}
  }, [quantity, updateCustomData])

  return (
    <div className={`${handles.bagsContainer} flex flex-column items-center`}>
      <h4 className={`${handles.title} t-heading-4 tc c-on-base`}>
        {intl.formatMessage(messages.title)}
      </h4>
      <div className="flex flex-row justify-center items-center">
        <NumericStepper
          size="large"
          value={quantity}
          disabled={loading}
          onChange={(event: { value: React.SetStateAction<number> }) =>
            setQuantity(event.value)
          }
        />
      </div>
    </div>
  )
}

export default Bags
