import React from 'react'
import { Input, Dropdown } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import messages from './messages'

const CSS_HANDLES = ['invoiceForm', 'invoiceInput'] as const

const NaturalForm = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const [data, setData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    documentType: '',
    document: '',
    phone: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <form className={`${handles.invoiceForm} flex flex-column`}>
      <div className="mb4">
        <Input
          label={<FormattedMessage id={messages.email.id} />}
          name="email"
          placeholder={intl.formatMessage(messages.emailPlaceholder)}
          type="email"
          value={data.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-row justify-between items-center mb4">
        <div className="w-50 pr2">
          <Input
            label={<FormattedMessage id={messages.firstName.id} />}
            name="firstName"
            placeholder={intl.formatMessage(messages.firstNamePlaceholder)}
            type="text"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-50 pl2">
          <Input
            label={<FormattedMessage id={messages.lastName.id} />}
            name="lastName"
            placeholder={intl.formatMessage(messages.lastNamePlaceholder)}
            type="text"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mb4">
        <div className="w-50 pr2">
          <Dropdown
            label={intl.formatMessage(messages.documentType)}
            name="documentType"
            options={[
              {
                value: 'DNI',
                label: intl.formatMessage(messages.documentTypeOptionDNI),
              },
              {
                value: 'NIT',
                label: intl.formatMessage(messages.documentTypeOptionNIT),
              },
            ]}
            value={data.documentType}
            onChange={handleSelect}
            required
          />
        </div>
        <div className="w-50 pl2">
          <Input
            label={<FormattedMessage id={messages.document.id} />}
            name="document"
            placeholder={intl.formatMessage(messages.documentPlaceholder)}
            type="text"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="mb4">
        <Input
          label={<FormattedMessage id={messages.phone.id} />}
          name="phone"
          placeholder={intl.formatMessage(messages.phonePlaceholder)}
          type="tel"
          value={data.email}
          onChange={handleChange}
          required
        />
      </div>
    </form>
  )
}

export default NaturalForm
