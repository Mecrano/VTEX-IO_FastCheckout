import React, { useEffect, useState } from 'react'
import { Input, Dropdown } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMutation } from 'react-apollo'
import UPDATE_PROFILE from 'vtex.checkout-resources/MutationUpdateOrderFormProfile'

import messages from './messages'

const CSS_HANDLES = ['invoiceForm', 'invoiceInput'] as const

const NaturalForm = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { orderForm, setOrderForm, loading } = useOrderForm()
  const [data, setData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    documentType: '',
    document: '',
    phone: '',
  })

  const [
    updateProfile,
    {
      data: updateProfileData,
      loading: updateProfileLoading,
      error: updateProfileError,
    },
  ] = useMutation(UPDATE_PROFILE)

  useEffect(() => {
    const { email, firstName, lastName, documentType, document, phone } =
      orderForm?.clientProfileData || {}

    setData({
      email: email || '',
      firstName: firstName || '',
      lastName: lastName || '',
      documentType: documentType || '',
      document: document || '',
      phone: phone || '',
    })
  }, [orderForm?.clientProfileData])

  useEffect(() => {
    if (updateProfileError) {
      console.error('Error updating profile:', updateProfileError)

      return
    }

    if (updateProfileLoading) {
      return
    }

    if (updateProfileData?.updateOrderFormProfile?.id === orderForm?.id) {
      setOrderForm(updateProfileData.updateOrderFormProfile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updateProfileData,
    updateProfileError,
    updateProfileLoading,
    setOrderForm,
  ])

  useEffect(() => {}, [updateProfileError])

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

  const updateOrderFormField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    updateProfile({
      variables: {
        profile: {
          [name]: value,
        },
      },
    })
  }

  return (
    <div className={`${handles.invoiceForm} flex flex-column`}>
      <div className="mb4">
        <Input
          label={<FormattedMessage id={messages.email.id} />}
          name="email"
          placeholder={intl.formatMessage(messages.emailPlaceholder)}
          type="email"
          value={data.email}
          onChange={handleChange}
          onBlur={updateOrderFormField}
          disabled={loading || updateProfileLoading}
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
            value={data.firstName}
            onChange={handleChange}
            disabled={
              !orderForm?.canEditData ||
              loading ||
              updateProfileLoading ||
              !data.email
            }
            required
          />
        </div>
        <div className="w-50 pl2">
          <Input
            label={<FormattedMessage id={messages.lastName.id} />}
            name="lastName"
            placeholder={intl.formatMessage(messages.lastNamePlaceholder)}
            type="text"
            value={data.lastName}
            onChange={handleChange}
            onBlur={updateOrderFormField}
            disabled={
              !orderForm?.canEditData ||
              loading ||
              updateProfileLoading ||
              !data.email
            }
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
                value: 'cedulaCOL',
                label: intl.formatMessage(messages.documentTypeOptionDNI),
              },
              {
                value: 'NIT',
                label: intl.formatMessage(messages.documentTypeOptionNIT),
              },
            ]}
            value={data.documentType}
            onChange={handleSelect}
            disabled={
              !orderForm?.canEditData ||
              loading ||
              updateProfileLoading ||
              !data.email
            }
            required
          />
        </div>
        <div className="w-50 pl2">
          <Input
            label={<FormattedMessage id={messages.document.id} />}
            name="document"
            placeholder={intl.formatMessage(messages.documentPlaceholder)}
            type="text"
            value={data.document}
            onChange={handleChange}
            disabled={
              !orderForm?.canEditData ||
              loading ||
              updateProfileLoading ||
              !data.email
            }
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
          value={data.phone}
          onChange={handleChange}
          disabled={
            !orderForm?.canEditData ||
            loading ||
            updateProfileLoading ||
            !data.email
          }
          required
        />
      </div>
    </div>
  )
}

export default NaturalForm
