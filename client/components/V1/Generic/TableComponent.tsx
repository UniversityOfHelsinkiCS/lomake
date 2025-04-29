import React, { useState } from 'react'

export interface TableConfig {
  columns: string[] // Array of widths for each column. Width can be specified with CSS grid units (e.g. '100px', '50%', '1fr')
  body?: {
    firstColumnStyle?: {
      width?: string // Width of the first column. Width can be specified with CSS grid units (e.g. '100px', '50%', '1fr')a
      boxed?: boolean // Whether to apply a boxed style to the first column
    }
  }
}

export const Table = ({ children, config }: { children: React.ReactNode; config: TableConfig }) => {
  const childrenWithConfig = React.Children.map(children, child => {
    if (React.isValidElement<{ config?: TableConfig }>(child)) {
      return React.cloneElement(child, { config })
    }
    return child
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
      }}
    >
      {childrenWithConfig}
    </div>
  )
}

export const TableHead = ({ children, config }: { children: React.ReactNode; config?: TableConfig }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {React.Children.map(children, child => {
        if (React.isValidElement<{ config?: TableConfig; isHeader?: boolean }>(child)) {
          return React.cloneElement(child, { config, isHeader: true })
        }
        return child
      })}
    </div>
  )
}

export const TableBody = ({ children, config }: { children: React.ReactNode; config?: TableConfig }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {React.Children.map(children, child => {
        if (React.isValidElement<{ config?: TableConfig; isHeader?: boolean }>(child)) {
          return React.cloneElement(child, { config, isHeader: false })
        }
        return child
      })}
    </div>
  )
}

export const TableRow = ({
  children,
  config,
  isHeader,
}: {
  children: React.ReactNode
  config?: TableConfig
  isHeader?: boolean
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr',
        gridTemplateColumns: config?.columns?.join(' ') || 'repeat(auto-fill, 1fr)',
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (isHeader) {
          return <div>{child}</div>
        }

        let cellStyle = {
          backgroundColor: 'white',
          borderRight: index < React.Children.count(children) - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.3)',
          borderRadius: '0px',
          overflow: 'hidden',
        }

        const firstColBoxed = config?.body?.firstColumnStyle?.boxed

        if (!firstColBoxed && index === 0) {
          cellStyle = null
        } else if (!firstColBoxed && index === 1) {
          cellStyle['borderRadius'] = '0.5rem 0px 0px 0.5rem'
        } else if (!firstColBoxed && index === React.Children.count(children) - 1) {
          cellStyle['borderRadius'] = '0px 0.5rem 0.5rem 0px'
        } else if (index === 0) {
          cellStyle['borderRadius'] = '0.5rem 0px 0px 0.5rem'
        } else if (index === React.Children.count(children) - 1) {
          cellStyle['borderRadius'] = '0px 0.5rem 0.5rem 0px'
        }

        return <div style={cellStyle}>{child}</div>
      })}
    </div>
  )
}

export const TableCell = ({
  children,
  itemAlign = 'center',
  isHeader = false,
  disabled = false,
  onClick,
  hoverEffect = false,
  ...rest
}: {
  children?: React.ReactNode
  itemAlign?: 'left' | 'center' | 'right'
  isHeader?: boolean
  disabled?: boolean
  onClick?: () => void
  hoverEffect?: boolean
  rest?: any
}) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        opacity: disabled ? '0.5' : '1',
        display: 'flex',
        justifyContent: itemAlign,
        alignItems: 'center',
        textAlign: itemAlign,
        padding: '1.5rem',
        width: '100%',
        height: '100%',
        cursor: hoverEffect || onClick ? 'pointer' : 'default',
        transition: 'background-color 0.2s',
        backgroundColor:
          !isHeader && disabled
            ? 'rgba(0,0,0,0.06)'
            : (hoverEffect || onClick) && isHovering
              ? 'rgba(0,0,0,0.06)'
              : 'transparent',
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
