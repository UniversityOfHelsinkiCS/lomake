import { useRef } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import useOnClickOutside from '../../util/useOnClickOutside'
import './Generic.scss'

const CustomModal = ({ children, title, closeModal, borderColor }) => {
  const ref = useRef()
  useOnClickOutside(ref, closeModal)
  return (
    <div className="customModal-dimmer">
      <div
        className="customModal-content"
        ref={ref}
        style={borderColor ? { border: '3px solid', borderColor, maxHeight: '95%' } : { maxHeight: '95%' }}
      >
        <div className="title-and-close">
          <span style={{ maxWidth: '95%' }}>{title}</span>
          <CloseIcon color="error" data-cy="close-modal" onClick={closeModal} sx={{ cursor: 'pointer' }} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default CustomModal
