import React, { useState } from 'react'

/*
Example usage:

import { Table, TableRow, TableHead, TableBody, TableCell } from './TableComponent'

<Table variant="overview">
  <TableHead>
    <TableRow>
      <TableCell itemAlign="left">Header 1</TableCell>
      <TableCell>Header 2</TableCell>
      <TableCell>Header 3</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
      <TableRow>
        <TableCell itemAlign="left">Row 1, Cell 1</TableCell>
        <TableCell>Row 2, Cell 2</TableCell>
        <TableCell>Row 3, Cell 3</TableCell>
      </TableRow>
  </TableBody>
</Table>

Table component:
  required param: variant: 'overview' | 'programme'

TableHead component:
  optional param: variant: 'overview' | 'programme'

TableBody component:
  optional param: variant: 'overview' | 'programme'

TableRow component:
  optional param: variant: 'overview' | 'programme' | 'single-cell'

TableCell component:
  optional param: itemAlign: 'left' | 'center' | 'right'
  optional param: disabled: boolean
  optional param: onClick: () => void
  optional param: hoverEffect: boolean
  optional param: style: React.CSSProperties
*/

export const Table = ({ children, variant }: { children: React.ReactNode; variant: 'overview' | 'programme' }) => {
  const childrenWithConfig = React.Children.map(children, child => {
    if (React.isValidElement<{ variant: string }>(child)) {
      return React.cloneElement(child, { variant })
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

export const TableHead = ({ children, variant }: { children: React.ReactNode; variant?: 'overview' | 'programme' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {React.Children.map(children, child => {
        if (React.isValidElement<{ isHeader: boolean; variant: string }>(child)) {
          const existingProps = child.props as any

          return React.cloneElement(child, { isHeader: true, variant: existingProps.variant || variant })
        }
        return child
      })}
    </div>
  )
}

export const TableBody = ({ children, variant }: { children: React.ReactNode; variant?: 'overview' | 'programme' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {React.Children.map(children, child => {
        if (React.isValidElement<{ isHeader: boolean; variant: string }>(child)) {
          const existingProps = child.props as any

          return React.cloneElement(child, { isHeader: false, variant: existingProps.variant || variant })
        }
        return child
      })}
    </div>
  )
}

export const TableRow = ({
  children,
  isHeader,
  variant,
}: {
  children: React.ReactNode
  isHeader?: boolean // gets passed from TableHead or TableBody
  variant?: 'overview' | 'programme' | 'single-cell' // gets passed from TableHead or TableBody
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
      }}
    >
      {React.Children.map(children, (child, index) => {
        let frac
        let boxed
        let rowLength = React.Children.count(children)
        let borderRadius = '0 0 0 0'

        switch (variant) {
          case 'overview':
            frac = index === 0 ? 2 : 1
            boxed = !isHeader

            if (index === 0) {
              borderRadius = '0.5rem 0 0 0.5rem'
            } else if (index === rowLength - 1) {
              borderRadius = '0 0.5rem 0.5rem 0'
            }
            break

          case 'programme':
            frac = index === 0 ? 0.5 : 1
            boxed = !isHeader && index !== 0

            if (index === 1) {
              borderRadius = '0.5rem 0 0 0.5rem'
            } else if (index === rowLength - 1) {
              borderRadius = '0 0.5rem 0.5rem 0'
            }
            break

          case 'single-cell':
            frac = 1
            boxed = !isHeader
            borderRadius = '0.5rem'
            break

          default:
            break
        }

        return (
          <div
            style={{
              flex: `${frac} 0 0%`,
              boxShadow: boxed && '0px 1px 3px rgba(0,0,0,0.3)',
              borderRight: index < rowLength - 1 && boxed ? '1px solid rgba(0,0,0,0.2)' : 'none',
              borderRadius: borderRadius,
              backgroundColor: 'white',
            }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}

export const TableCell = ({
  children,
  itemAlign = 'center',
  disabled = false,
  onClick,
  hoverEffect = false,
  style,
  isHeader = false, // gets passed from TableRow
  ...rest
}: {
  children?: React.ReactNode
  itemAlign?: 'left' | 'center' | 'right'
  isHeader?: boolean
  disabled?: boolean
  onClick?: () => void
  hoverEffect?: boolean
  style?: React.CSSProperties
  rest?: any
}) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        ...style,
        opacity: disabled ? '0.5' : '1',
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: itemAlign,
        alignItems: 'center',
        textAlign: itemAlign,
        padding: '1.5rem',
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
