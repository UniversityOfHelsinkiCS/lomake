import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Header, Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import User from 'Components/UsersPage/User'
import { isSuperAdmin } from '../../../config/common'

export default () => {
  const [sorter, setSorter] = useState('email')
  const [reverse, setReverse] = useState(false)

  const users = useSelector((state) => state.users.data)
  const user = useSelector(({ currentUser }) => currentUser.data)
  const history = useHistory()

  if (!user.admin) {
    history.push('/')
  }

  if (!users) return null

  let sortedUsers = users.sort((a, b) => {
    if (typeof a[sorter] === 'string') return a[sorter].localeCompare(b[sorter])
    if (typeof a[sorter] === 'boolean') return a[sorter] - b[sorter]
  })

  if (reverse) sortedUsers.reverse()

  const CustomHeader = ({ width, name, field, sortable = true }) => {
    const sortHandler = sortable
      ? () => {
          if (sorter === field) {
            setReverse(!reverse)
          } else {
            setSorter(field)
          }
        }
      : undefined
    const style = sortable ? { cursor: 'pointer' } : {}

    return (
      <Grid.Column style={{ display: 'flex', alignItems: 'baseline' }} width={width}>
        <Header onClick={sortHandler} style={style} as="h4">
          {name}
        </Header>
        {sortable && <Icon name="sort" />}
      </Grid.Column>
    )
  }

  return (
    <Grid celled="internally">
      <Grid.Row>
        <CustomHeader width={3} name="Name" field="lastname" />
        <CustomHeader width={2} name="User id" field="uid" />
        <CustomHeader width={3} name="Email" field="email" />
        <CustomHeader width={5} name="Access" field="access" sortable={false} />
        <CustomHeader width={1} name="Admin" field="admin" />
        <CustomHeader width={1} name="Hide" field="irrelevant" />
        {isSuperAdmin(user.uid) && <CustomHeader width={1} name="Hijack" sortable={false} />}
      </Grid.Row>
      {sortedUsers.map((u) => (
        <User user={u} key={u.id} />
      ))}
    </Grid>
  )
}
