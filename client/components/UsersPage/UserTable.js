import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Header, Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import User from 'Components/UsersPage/User'
import { sortedItems } from 'Utilities/common'
import { isSuperAdmin } from '../../../config/common'
import { Input } from 'semantic-ui-react'

export default () => {
  const [sorter, setSorter] = useState('email')
  const [reverse, setReverse] = useState(false)
  const [filter, setFilter] = useState('')

  const users = useSelector((state) => state.users.data)
  const user = useSelector(({ currentUser }) => currentUser.data)
  const history = useHistory()

  if (!user.admin) {
    history.push('/')
  }

  if (!users) return null

  let sortedUsersToShow = sortedItems(users, sorter)

  if (reverse) sortedUsersToShow.reverse()
  sortedUsersToShow = sortedUsersToShow.filter((user) =>
    Object.keys(user.access)
      .join(', ')
      .toString()
      .toLocaleLowerCase()
      .includes(filter.toLocaleLowerCase())
  )

  const CustomHeader = ({ width, name, field, sortable = true }) => {
    const sortHandler = sortable
      ? () => {
          if (sorter === field) {
            setReverse(!reverse)
          } else {
            setReverse(false)
            setSorter(field)
          }
        }
      : undefined
    const style = sortable ? { cursor: 'pointer' } : {}

    return (
      <Grid.Column
        onClick={sortHandler}
        style={{ display: 'flex', alignItems: 'baseline', ...style }}
        width={width}
      >
        <Header as="h4">{name}</Header>
        {sortable && <Icon name="sort" />}
      </Grid.Column>
    )
  }

  return (
    <>
      <Input
        value={filter}
        onChange={(e, { value }) => setFilter(value)}
        icon="users"
        iconPosition="left"
        placeholder="Filter users by access"
      />

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
        {sortedUsersToShow.map((u) => (
          <User user={u} key={u.id} />
        ))}
      </Grid>
    </>
  )
}
