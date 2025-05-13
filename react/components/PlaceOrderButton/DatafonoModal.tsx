import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import datafonoService from '../../services/DatafonoService'
import messages from './messages'

const CSS_HANDLES = [
  'datafonoModal',
  'datafonoModalContent',
  'datafonoModalTitle',
  'datafonoModalImage',
  'datafonoModalAlert',
  'datafonoModalButton',
] as const

interface DatafonoModalProps {
  isOpen: boolean
  orderFormId: string
  onClose: () => void
  onSuccess: () => void
}

const DatafonoModal: React.FC<DatafonoModalProps> = ({
                                                       isOpen,
                                                       orderFormId,
                                                       onClose,
                                                       onSuccess
                                                     }) => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const [showAlert, setShowAlert] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateTransactionStatus = useCallback(async () => {
    try {
      const response = await datafonoService.validateTransaction(orderFormId)

      if (!response.success) {
        throw new Error(intl.formatMessage(messages.transactionFailed))
      }

      switch (response.status) {
        case 'waiting':
        case 'unknown':
          break
        case 'approved':
          // window.open('/files/print-receipt.html', '_blank')
          onSuccess()
          break
        case 'declined':
        case 'canceled':
          onClose()
          alert(intl.formatMessage(messages.transactionCanceled))
          break
        default:
          console.warn(intl.formatMessage(messages.unknownStatus), response.status)
          break
      }
    } catch (error) {
      console.error('Error validando transacción:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      onClose()
    }
  }, [orderFormId, onClose, onSuccess, intl])

  useEffect(() => {
    let interval: number | null = null

    const startValidation = async () => {
      try {
        await datafonoService.startTransaction(orderFormId)
        interval = window.setInterval(validateTransactionStatus, 5000)
      } catch (error) {
        console.error('Error iniciando transacción:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido')
        onClose()
      }
    }

    if (isOpen) {
      startValidation()

      const alertTimeout = setTimeout(() => {
        setShowAlert(true)
      }, 90000)

      return () => {
        if (interval) {
          clearInterval(interval)
        }
        clearTimeout(alertTimeout)
      }
    }

    return undefined
  }, [isOpen, orderFormId, validateTransactionStatus, onClose])

  const handleCancelTransaction = async () => {
    try {
      await datafonoService.cancelTransaction(orderFormId)
      onClose()
    } catch (error) {
      console.error('Error cancelando transacción:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      onClose()
    }
  }

  if (!isOpen) return null

  if (error) {
    alert(error)
    return null
  }

  return (
    <div
      className={handles.datafonoModal}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000000000,
      }}
    >
      <div
        className={handles.datafonoModalContent}
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          width: '350px',
          position: 'relative',
        }}
      >
        <h2 className={handles.datafonoModalTitle}>
          {intl.formatMessage(messages.datafonoModalTitle)}
        </h2>

        <img
          className={handles.datafonoModalImage}
          src="https://ingenico.com/sites/default/files/styles/600x600/public/product/2023-06/Ingenico-Lane-5000-3_4.png.webp"
          alt="Datáfono"
          style={{ width: '100%', margin: '15px 0' }}
        />

        {showAlert && (
          <div
            className={handles.datafonoModalAlert}
            style={{
              display: 'block',
              padding: '15px',
              margin: '0 0 15px',
              borderRadius: '5px',
              textAlign: 'center',
              fontWeight: 'bold',
              backgroundColor: '#fff3cd',
              color: '#856404',
              border: '1px solid #ffeeba',
              fontSize: '15px',
            }}
          >
            {intl.formatMessage(messages.datafonoModalAlert)}
          </div>
        )}

        <button
          className={handles.datafonoModalButton}
          onClick={handleCancelTransaction}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            borderRadius: '5px',
          }}
        >
          {intl.formatMessage(messages.cancelTransaction)}
        </button>
      </div>
    </div>
  )
}

export default DatafonoModal
