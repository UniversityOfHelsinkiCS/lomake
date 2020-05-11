import React, { useRef } from 'react'
import './CustomModal.scss'
import { Icon } from 'semantic-ui-react'
import useOnClickOutside from '../../util/useOnClickOutside'

const CustomModal = ({ children, title, closeModal, borderColor }) => {
  const ref = useRef()
  useOnClickOutside(ref, closeModal)
  console.log('borderColor', borderColor)
  return (
    <div className="outer">
      <div
        className="inner"
        style={borderColor ? { border: '3px solid', borderColor } : {}}
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
