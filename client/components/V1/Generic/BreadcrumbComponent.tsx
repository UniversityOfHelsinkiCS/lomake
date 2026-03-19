/* eslint-disable react/function-component-definition */
import { Breadcrumbs, Link, Typography } from '@mui/material'

export default function BreadcrumbComponent({ links }: { links: Array<{ label: string; href: string }> }) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {links.map((link, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Link href={link.href} key={index} sx={{ textDecoration: 'none' }} underline="hover">
            <Typography variant="regular">{link.label}</Typography>
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}
