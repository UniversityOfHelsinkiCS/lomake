/* eslint-disable react/function-component-definition */
import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Clear from '@mui/icons-material/Clear'
import type { SxProps, Theme } from '@mui/material/styles'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
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
  contentSx,
  ...rest
}: {
  children?: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  contentSx?: SxProps<Theme>
  rest?: any
}) {
  // const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Modal onClose={handleClose} open={open} {...rest}>
      <Box sx={contentSx ? ([style, contentSx] as SxProps<Theme>) : style}>
        <Clear onClick={handleClose} style={{ position: 'absolute', top: '2rem', right: '2rem', cursor: 'pointer' }} />
        {children}
      </Box>
    </Modal>
  )
}
