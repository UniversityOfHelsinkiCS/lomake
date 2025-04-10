import { Badge, Tooltip } from '@mui/material'
import React from 'react'

interface NotificationBadgeProps {
  variant?: 'small' | 'medium'
  children?: React.ReactNode
  style?: React.CSSProperties
  tooltip?: string | null
}

const NotificationBadge = ({ variant = 'small', children, style, tooltip, ...rest }: NotificationBadgeProps) => {
  const increasedSpacing = {
    // increase the "hitbox" of the tooltip on small badges
    content: '""',
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    pointerEvents: 'auto',
  }

  const badgeComponent =
    variant === 'small' ? (
      <Badge
        overlap="circular"
        color="info"
        variant="dot"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          ...style,
          marginLeft: '0.25rem',
          marginBottom: '2rem',
          position: 'relative',
          '&::before': increasedSpacing,
        }}
        {...rest}
      >
        {children}
      </Badge>
    ) : (
      <Badge badgeContent="!" color="info" style={{ ...style }} {...rest}>
        {children}
      </Badge>
    )

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="top" arrow>
        {badgeComponent}
      </Tooltip>
    )
  }

  return badgeComponent
}

export default NotificationBadge
