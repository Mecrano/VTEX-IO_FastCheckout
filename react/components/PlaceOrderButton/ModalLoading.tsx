import React from 'react'
import { Modal, Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

interface ModalLoadingProps {
  isOpen: boolean
}

const CSS_HANDLES = ['modalLoadingContainer'] as const

const ModalLoading = ({ isOpen }: ModalLoadingProps) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.modalLoadingContainer}>
      <Modal
        centered
        closeOnEsc={false}
        closeOnOverlayClick={false}
        showCloseIcon={false}
        isOpen={isOpen}
        onClose={() => {}}
      >
        <div className="flex items-center justify-center flex-column pa5 w-100 h-100">
          <h3 className="t-heading-3 mb7">Procesando tu pedido...</h3>
          <Spinner />
        </div>
      </Modal>
    </div>
  )
}

export default ModalLoading
