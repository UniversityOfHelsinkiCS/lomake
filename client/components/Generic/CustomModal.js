import React, { useRef } from 'react'
import './CustomModal.scss'
import { Icon } from 'semantic-ui-react'
import useOnClickOutside from '../../util/useOnClickOutside'

const CustomModal = ({ children, title, closeModal, borderColor }) => {
  const ref = useRef()
  useOnClickOutside(ref, closeModal)
  return (
    <div className="customModal-dimmer">
      <div
        className="customModal-content"
        style={borderColor ? { border: '3px solid', borderColor, maxHeight: '90%' } : { maxHeight: '90%' }}
        ref={ref}
      >
        <div className="title-and-close">
          <span style={{ maxWidth: '75%' }}>{title}</span>
          <Icon name="close" onClick={closeModal} style={{ cursor: 'pointer' }} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default CustomModal
