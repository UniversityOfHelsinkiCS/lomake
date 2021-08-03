import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Header, Input, Icon, Table } from 'semantic-ui-react'
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

  const getCustomHeader = ({ name, field, sortable = true }) => {
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

    return (
      <Table.HeaderCell
        onClick={sortHandler}
        style={sortable ? { cursor: 'pointer' } : {} }
      >
        {name} {sortable && <Icon name="sort" />}
      </Table.HeaderCell>
    )
  }

  return (
    <>
      <Table className="user-filter-container">
        <Table.Body>
          <Table.Row>
            <Table.Cell width={3}>
              <Input
                value={nameFilter}
                onChange={(e, { value }) => setNameFilter(value)}
                icon="search"
                iconPosition="left"
                placeholder={translations.searchByName[lang]}
              />
            </Table.Cell>
            <Table.Cell width={4} />
            <Table.Cell width={4}>
              <Input
                value={accessFilter}
                onChange={(e, { value }) => setAccessFilter(value)}
                icon="users"
                iconPosition="left"
                placeholder={translations.filterByAccess[lang]}
              />
            </Table.Cell>
            <Table.Cell width={4} />
          </Table.Row>
        </Table.Body>
      </Table>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {getCustomHeader({ name: translations.name[lang], field: "lastname" })}
            {getCustomHeader({ name: translations.userId[lang], field: "uid" })}
            {getCustomHeader({ name: translations.email[lang], field: "email" })}
            {getCustomHeader({ name: translations.access[lang], field: "access", sortable: false })}
            {getCustomHeader({ name: translations.userGroup[lang], field: "userGroup" })}
            {getCustomHeader({ name: translations.deleteUser[lang], field: "deleteUser", sortable: false})}
            {isSuperAdmin(user.uid) && getCustomHeader({ name: "Hijack", field: "deleteUser", sortable: false })}
          </Table.Row>
        </Table.Header>
        {filteredUsers().map((u) => (
          <User lang={lang} user={u} key={u.id} />
        ))}
      </Table>
    </>
  )
}
