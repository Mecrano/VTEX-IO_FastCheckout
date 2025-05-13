import React, { useEffect, useState } from 'react'
import { Input, Dropdown } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMutation } from 'react-apollo'
import UPDATE_PROFILE from 'vtex.checkout-resources/MutationUpdateOrderFormProfile'

import UPDATE_CUSTOM_DATA from '../../graphql/mutation.setOrderFormCustomData.gql'
import messages from './messages'

const CSS_HANDLES = ['invoiceForm', 'invoiceInput'] as const

const LegalForm = () => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { orderForm, setOrderForm, loading } = useOrderForm()
  const [disableFields, setDisableFields] = useState(false)
  const [data, setData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    documentType: '',
    document: '',
    phone: '',
    isCorporate: true,
    corporateName: '',
    tradeName: '',
    corporateDocument: '',
    stateInscription: '',
    invoiceAddress: '',
  })

  const [
    updateProfile,
    {
      data: updateProfileData,
      loading: updateProfileLoading,
      error: updateProfileError,
    },
  ] = useMutation(UPDATE_PROFILE)

  const [
    updateCustomData,
    {
      data: updateCustomDataData,
      loading: updateCustomDataLoading,
      error: updateCustomDataError,
    },
  ] = useMutation(UPDATE_CUSTOM_DATA)

  useEffect(() => {
    const {
      email,
      firstName,
      lastName,
      documentType,
      document,
      phone,
      corporateName,
      tradeName,
      corporateDocument,
      stateInscription,
    } = orderForm?.clientProfileData || {}

    const customDataFastCheckout = orderForm?.customData?.customApps?.find(
      ({ id }: any) => id === 'fast-checkout'
    )

    setData({
      email: email || '',
      firstName: firstName || '',
      lastName: lastName || '',
      documentType: documentType || '',
      document: document || '',
      phone: phone || '',
      isCorporate: true,
      corporateName: corporateName || '',
      tradeName: tradeName || '',
      corporateDocument: corporateDocument || '',
      stateInscription: stateInscription || '',
      invoiceAddress: customDataFastCheckout?.fields?.invoiceAddress || '',
    })
  }, [orderForm?.clientProfileData, orderForm?.customData])

  useEffect(() => {
    setDisableFields(false)

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

  useEffect(() => {
    setDisableFields(false)

    if (updateCustomDataError) {
      console.error('Error updating custom data:', updateCustomDataError)

      return
    }

    if (updateCustomDataLoading) {
      return
    }

    if (updateCustomDataData?.setOrderFormCustomData?.id === orderForm?.id) {
      setOrderForm(updateCustomDataData?.setOrderFormCustomData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updateCustomDataData,
    updateCustomDataLoading,
    updateCustomDataError,
    setOrderForm,
  ])

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

    if (name === 'email') {
      setDisableFields(true)
      updateProfile({
        variables: {
          profile: {
            isCorporate: true,
            [name]: value,
          },
        },
      })
    } else if (name === 'corporateName') {
      updateProfile({
        variables: {
          profile: {
            ...data,
            [name]: value,
            tradeName: value,
          },
        },
      })
    } else if (name === 'stateInscription') {
      updateProfile({
        variables: {
          profile: {
            ...data,
            [name]: value,
            corporateDocument: value,
          },
        },
      })
    } else if (name === 'invoiceAddress') {
      updateCustomData({
        variables: {
          appId: 'fast-checkout',
          field: name,
          value,
        },
      })
    } else {
      updateProfile({
        variables: {
          profile: {
            ...data,
            [name]: value,
          },
        },
      })
    }
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
          disabled={loading}
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
            onBlur={updateOrderFormField}
            disabled={
              !orderForm?.canEditData || loading || disableFields || !data.email
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
              !orderForm?.canEditData || loading || disableFields || !data.email
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
                value: 'cedulaExt',
                label: intl.formatMessage(messages.documentTypeOptionCE),
              },
            ]}
            value={data.documentType}
            onChange={handleSelect}
            onBlur={updateOrderFormField}
            disabled={
              !orderForm?.canEditData || loading || disableFields || !data.email
            }
            required
          />
        </div>
        <div className="w-50 pl2">
          <Input
            label={<FormattedMessage id={messages.document.id} />}
            name="document"
            placeholder={intl.formatMessage(messages.documentPlaceholder)}
            type="number"
            value={data.document}
            onChange={handleChange}
            onBlur={updateOrderFormField}
            disabled={
              !orderForm?.canEditData || loading || disableFields || !data.email
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
          onBlur={updateOrderFormField}
          disabled={
            !orderForm?.canEditData || loading || disableFields || !data.email
          }
          required
        />
      </div>
      <div className="flex flex-row justify-between items-center mb4">
        <div className="w-50 pr2">
          <Input
            label={<FormattedMessage id={messages.corporateName.id} />}
            name="corporateName"
            placeholder={intl.formatMessage(messages.corporateNamePlaceholder)}
            type="text"
            value={data.corporateName}
            onChange={handleChange}
            onBlur={updateOrderFormField}
            disabled={
              !orderForm?.canEditData || loading || disableFields || !data.email
            }
            required
          />
        </div>
        <div className="w-50 pl2">
          <Input
            label={<FormattedMessage id={messages.stateInscription.id} />}
            name="stateInscription"
            placeholder={intl.formatMessage(
              messages.stateInscriptionPlaceholder
            )}
            type="number"
            value={data.stateInscription}
            onChange={handleChange}
            onBlur={updateOrderFormField}
            disabled={
              !orderForm?.canEditData || loading || disableFields || !data.email
            }
            required
          />
        </div>
      </div>
      <div className="mb4">
        <Input
          label={<FormattedMessage id={messages.invoiceAddress.id} />}
          name="invoiceAddress"
          placeholder={intl.formatMessage(messages.invoiceAddressPlaceholder)}
          type="tel"
          value={data.invoiceAddress}
          onChange={handleChange}
          onBlur={updateOrderFormField}
          disabled={
            !orderForm?.canEditData || loading || disableFields || !data.email
          }
          required
        />
      </div>
    </div>
  )
}

export default LegalForm
