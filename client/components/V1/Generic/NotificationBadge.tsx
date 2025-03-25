import { Badge } from '@mui/material'
import React from 'react'

interface NotificationBadgeProps {
  variant?: 'small' | 'medium'
  children?: React.ReactNode
}

const NotificationBadge = ({ variant = 'small', children }: NotificationBadgeProps) => {
  return variant === 'small' ? (
    <Badge
      overlap="circular"
      color="info"
      variant="dot"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      style={{}}
    >
      {children}
    </Badge>
  ) : (
    <Badge badgeContent="!" color="info">
      {children}
    </Badge>
  )
}

export default NotificationBadge
