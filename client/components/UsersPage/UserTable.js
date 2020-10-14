import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Header, Input, Icon, Loader } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import User from 'Components/UsersPage/User'
import useDebounce from 'Utilities/useDebounce'
import { sortedItems } from 'Utilities/common'
import { isSuperAdmin } from '../../../config/common'


export default () => {
  const [sorter, setSorter] = useState('')
  const [reverse, setReverse] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [accessFilter, setAccessFilter] = useState('')
  const debouncedName = useDebounce(nameFilter, 200)

  const users = useSelector((state) => state.users.data)
  const user = useSelector(({ currentUser }) => currentUser.data)
  const history = useHistory()

  if (!user.admin) {
    history.push('/')
  }

  if (!users) return null

  let sortedUsersToShow = sortedItems(users, sorter)

  if (reverse) sortedUsersToShow.reverse()

  const filteredUsers = () => {

    if (!nameFilter && !accessFilter) return sortedUsersToShow

    const byName = sortedUsersToShow.filter((user) => {
      if (!nameFilter) return true
      const firstname = user.firstname.toLowerCase()
      const lastname = user.lastname.toLowerCase()
      return (firstname.includes(debouncedName.toLowerCase() || lastname.includes(debouncedName.toLowerCase())))
    })

    const byAccess = byName.filter((user) =>
    Object.keys(user.access)
      .join(', ')
      .toString()
      .toLocaleLowerCase()
      .includes(accessFilter.toLocaleLowerCase())
    )
    return byAccess
  }

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
      <Grid className="user-filter-container">
        <Grid.Column width={3}>
          <Input
            value={nameFilter}
            onChange={(e, { value }) => setNameFilter(value)}
            icon="search"
            iconPosition="left"
            placeholder="Search users by name"
          />
        </Grid.Column>
        <Grid.Column width={5}/>
        <Grid.Column width={5}>
          <Input
            value={accessFilter}
            onChange={(e, { value }) => setAccessFilter(value)}
            icon="users"
            iconPosition="left"
            placeholder="Filter users by access"
          />
        </Grid.Column>
        <Grid.Column width={2}/>
      </Grid>
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
        {filteredUsers().map((u) => (
          <User user={u} key={u.id} />
        ))}
      </Grid>
    </>
  )
}
