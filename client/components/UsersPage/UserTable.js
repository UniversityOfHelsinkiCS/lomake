import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Header, Input, Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import User from 'Components/UsersPage/User'
import useDebounce from 'Utilities/useDebounce'
import { sortedItems } from 'Utilities/common'
import { isSuperAdmin } from '../../../config/common'
import { usersPageTranslations as translations } from 'Utilities/translations'

export default () => {
  const [sorter, setSorter] = useState('')
  const [reverse, setReverse] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [accessFilter, setAccessFilter] = useState('')
  const debouncedName = useDebounce(nameFilter, 200)

  const lang = useSelector((state) => state.language)
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
      
      return firstname.includes(debouncedName.toLowerCase()) || lastname.includes(debouncedName.toLowerCase())
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
            placeholder={translations.searchByName[lang]}
          />
        </Grid.Column>
        <Grid.Column width={5} />
        <Grid.Column width={4}>
          <Input
            value={accessFilter}
            onChange={(e, { value }) => setAccessFilter(value)}
            icon="users"
            iconPosition="left"
            placeholder={translations.filterByAccess[lang]}
          />
        </Grid.Column>
        <Grid.Column width={2} />
      </Grid>
      <Grid celled="internally">
        <Grid.Row>
          <CustomHeader width={2} name={translations.name[lang]} field="lastname" />
          <CustomHeader width={3} name={translations.userId[lang]} field="uid" />
          <CustomHeader width={3} name={translations.email[lang]} field="email" />
          <CustomHeader
            width={3}
            name={translations.access[lang]}
            field="access"
            sortable={false}
          />
          <CustomHeader width={4} name={translations.userGroup[lang]} field="userGroup" />
          {isSuperAdmin(user.uid) && <CustomHeader width={1} name="Hijack" sortable={false} />}
        </Grid.Row>
        {filteredUsers().map((u) => (
          <User lang={lang} user={u} key={u.id} />
        ))}
      </Grid>
    </>
  )
}
