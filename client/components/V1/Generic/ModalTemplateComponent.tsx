import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Clear from '@mui/icons-material/Clear'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  minWidth: 800,
  minHeight: 300,
  width: '65vw',
  maxWidth: '65vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: '4rem',
  outline: 'none',
}

export default function ModalTemplateComponent({
  children,
  open,
  setOpen,
  ...rest
}: {
  children?: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  rest?: any
}) {
  // const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Modal open={open} onClose={handleClose} {...rest}>
      <Box sx={style}>
        <Clear onClick={handleClose} style={{ position: 'absolute', top: '2rem', right: '2rem', cursor: 'pointer' }} />
        {children}
      </Box>
    </Modal>
  )
}
