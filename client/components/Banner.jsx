import { useState } from 'react'
import { Close as CloseIcon } from '@mui/icons-material'
import { Alert, IconButton } from '@mui/material'

export const Banner = ({ message, severity = 'warning' }) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div style={{ width: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
      <Alert
        action={
          <IconButton aria-label="close" color="inherit" onClick={() => setIsVisible(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        onClose={() => setIsVisible(false)}
        severity={severity}
      >
        {message}
      </Alert>
    </div>
  )
}
