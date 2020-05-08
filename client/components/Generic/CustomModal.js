import React, { useRef } from 'react'
import './CustomModal.scss'
import { Icon } from 'semantic-ui-react'
import useOnClickOutside from '../../util/useOnClickOutside'

const CustomModal = ({ children, title, closeModal }) => {
  const ref = useRef()
  useOnClickOutside(ref, closeModal)
  return (
    <div className="outer">
      <div className="inner" ref={ref}>
        <div className="title-and-close">
          {title}
          <Icon name="close" onClick={closeModal} style={{ cursor: 'pointer' }} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default CustomModal
