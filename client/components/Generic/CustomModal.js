import React, { useRef } from 'react'
import { Icon } from 'semantic-ui-react'

import useOnClickOutside from '../../util/useOnClickOutside'
import './Generic.scss'

const CustomModal = ({ children, title, closeModal, borderColor }) => {
  const ref = useRef()
  useOnClickOutside(ref, closeModal)
  return (
    <div className="customModal-dimmer">
      <div
        className="customModal-content"
        style={borderColor ? { border: '3px solid', borderColor, maxHeight: '95%' } : { maxHeight: '95%' }}
        ref={ref}
      >
        <div className="title-and-close">
          <span style={{ maxWidth: '95%' }}>{title}</span>
          <Icon data-cy="close-modal" name="close" onClick={closeModal} style={{ cursor: 'pointer' }} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default CustomModal
