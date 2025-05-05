import { Breadcrumbs, Link, Typography } from '@mui/material'

export default function BreadcrumbComponent({ links }: { links: Array<{ label: string; href: string }> }) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {links.map((link, index) => {
        return (
          <Link key={index} underline="hover" href={link.href} sx={{ textDecoration: 'none' }}>
            <Typography variant="regular">{link.label}</Typography>
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}
