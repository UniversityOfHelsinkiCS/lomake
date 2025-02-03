import React from 'react'

/*
This component is a table for displaying data designed for this project.

Example usage:
    <>
      <Table>
        <TableRow isHeader>
            <TableCell>Header 1</TableCell>
            <TableCell>Header 2</TableCell>
            <TableCell>Header 3</TableCell>
        </TableRow>

        <TableRow>
            <TableCell isKey>Item 1</TableCell>
            <TableCell>Item 2</TableCell>
            <TableCell>Item 3</TableCell>
        </TableRow>
      </Table>
    </>
*/

export const Table = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%"
        }}>{children}</div>
    )
}


export const TableRow = ({ children, isHeader = false }: { children: React.ReactNode, isHeader?: boolean }) => {
    return (
        <div style={{
            display: "grid",
            gridTemplateRows: "1fr",
            gridTemplateColumns: `2fr repeat(${React.Children.count(children)-1}, 1fr)`, // TODO: Make this dynamic
            boxShadow: isHeader ? "none" : "0px 1px 3px rgba(0,0,0,0.3)",
            borderRadius: "0.5rem"
        }}>
            {React.Children.map(children, (child, index) => (
                <div style={{
                    borderRight: index < React.Children.count(children) - 1 && !isHeader ? '1px solid rgba(0,0,0,0.2)' : 'none',
                    display: "flex",
                    placeItems: "center",
                    padding: "1.5rem",
                }}>
                    {child}
                </div>
            ))}
        </div>
    )
}


export const TableCell = ({ children, isKey = false }: { children?: React.ReactNode, isKey?: boolean }) => {
    return (
        <div style={{
            margin: !isKey && "0 auto",
            textAlign: isKey ? "left" : "center",
        }}>{children}</div>
    )
}