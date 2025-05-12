import React from 'react'
import { ButtonWithIcon, IconCaretLeft } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import messages from './messages'

const CSS_HANDLES = ['backLinkContainer'] as const

const BackButton = () => {
  const { navigate } = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)

  const goBack = () => {
    navigate({
      page: 'store.home',
    })
  }

  return (
    <div className={handles.backLinkContainer}>
      <ButtonWithIcon
        icon={<IconCaretLeft />}
        variation="secondary"
        onClick={goBack}
      >
        <FormattedMessage id={messages.back.id} />
      </ButtonWithIcon>
    </div>
  )
}

export default BackButton
