import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Clear from '@mui/icons-material/Clear'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  minWidth: 400,
  maxWidth: '60vw',
  p: 4,
  outline: 'none',
}

export default function ModalTemplateComponent({
  children,
  open,
  setOpen,
}: {
  children?: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}) {
  // const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Clear onClick={handleClose} style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer' }} />
        {children}
      </Box>
    </Modal>
  )
}
