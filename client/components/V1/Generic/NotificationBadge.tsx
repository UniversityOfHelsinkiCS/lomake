import { Badge } from '@mui/material'
import React from 'react'

interface NotificationBadgeProps {
  variant?: 'small' | 'medium'
  children?: React.ReactNode
  style?: React.CSSProperties
}

const NotificationBadge = ({ variant = 'small', children, style }: NotificationBadgeProps) => {
  return variant === 'small' ? (
    <Badge
      overlap="circular"
      color="info"
      variant="dot"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      style={{
        ...style,
        marginLeft: '0.25rem',
        marginBottom: '2rem',
      }}
    >
      {children}
    </Badge>
  ) : (
    <Badge badgeContent="!" color="info" style={{ ...style }}>
      {children}
    </Badge>
  )
}

export default NotificationBadge
