import React from 'react'

/*
This component is a purpose built table for displaying key figure data.

Example usage:
    <>
      <Table>
        <TableRow isHeader>
            <TableCell>Header 1</TableCell>
            <TableCell>Header 2</TableCell>
            <TableCell>Header 3</TableCell>
        </TableRow>

        <TableRow>
            <TableCell itemAlign="left">Item 1</TableCell>
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
            gridTemplateColumns: `2fr repeat(${React.Children.count(children) - 1}, 1fr)`, // TODO: Make this dynamic
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


export const TableCell = ({ children, itemAlign = "center" }: { children?: React.ReactNode, itemAlign?: "left" | "center" | "right" }) => {
    let margin = "0 auto";

    switch (itemAlign) {
        case "left":
            margin = "0 auto 0 0";
            break;
        case "right":
            margin = "0 0 0 auto";
            break;
        case "center":
            margin = "0 auto";
            break;
    }

    return (
        <div style={{ margin }}>{children}</div>
    )
}