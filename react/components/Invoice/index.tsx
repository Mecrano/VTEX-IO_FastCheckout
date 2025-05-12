import React, { useEffect, useState } from 'react'
import { SelectableCard } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import { LegalPerson, NaturalPerson } from '../Icons'
import LegalForm from './LegalForm'
import NaturalForm from './NaturalForm'
import messages from './messages'

const CSS_HANDLES = [
  'invoiceContainer',
  'invoiceSelector',
  'invoiceForm',
  'cardSelector',
] as const

const Invoice = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const [selected, setSelected] = useState<string | null>(null)
  const { orderForm } = useOrderForm()

  useEffect(() => {
    if (orderForm?.clientProfileData?.email) {
      if (orderForm.clientProfileData.isCorporate) {
        setSelected('legal')
      } else {
        setSelected('natural')
      }
    }
  }, [orderForm?.clientProfileData])

  return (
    <div className={handles.invoiceContainer}>
      <h3 className="t-heading-3 tc c-on-base">
        {intl.formatMessage(messages.title)}
      </h3>
      <div
        className={`${handles.invoiceSelector} ${handles.cardSelector} flex justify-center items-center`}
      >
        <SelectableCard
          hasGroupRigth
          hasGroupLeft
          noPadding
          selected={selected === 'legal'}
          onClick={() => setSelected('legal')}
        >
          <div className="pa7 flex items-center justify-center">
            <LegalPerson size="50" />
            <div className="ml3 f4 tc">
              <FormattedMessage id={messages.legalPerson.id} />
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
          <div className="pa7 flex items-center justify-center">
            <NaturalPerson size="50" />
            <div className="ml3 f4 tc">
              <FormattedMessage id={messages.naturalPerson.id} />
            </div>
          </div>
        </SelectableCard>
      </div>
      <div className={handles.invoiceForm}>
        {selected === 'legal' && <LegalForm />}
        {selected === 'natural' && <NaturalForm />}
      </div>
    </div>
  )
}

export default Invoice
