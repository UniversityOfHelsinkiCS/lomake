import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Input, Icon, Loader, Table } from 'semantic-ui-react'
import { useHistory } from 'react-router'

import User from 'Components/UsersPage/User'
import useDebounce from 'Utilities/useDebounce'
import { sortedItems } from 'Utilities/common'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { isAdmin } from '@root/config/common'
import './UsersPage.scss'

export default () => {
  const [sorter, setSorter] = useState('')
  const [reverse, setReverse] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [accessFilter, setAccessFilter] = useState('')

  const debouncedName = useDebounce(nameFilter, 200)

  const lang = useSelector(state => state.language)
  const users = useSelector(state => state.users)
  const user = useSelector(({ currentUser }) => currentUser.data)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const history = useHistory()

  if (!isAdmin(user)) {
    history.push('/')
  }

  if (users.pending || !users.data || !usersProgrammes) return <Loader active inline="centered" />

  if (!users) return null

  const sortedUsersToShow = sortedItems(users.data, sorter)

  if (reverse) sortedUsersToShow.reverse()

  const mapProgrammes = programmes => {
    const programmeMap = new Map()
    programmes.forEach(p => programmeMap.set(p.key, p.name[lang]))
    return programmeMap
  }

  const programmeCodesAndNames = mapProgrammes(usersProgrammes)

  const filteredUsers = () => {
    if (!nameFilter && !accessFilter) return sortedUsersToShow

    const byName = sortedUsersToShow.filter(user => {
      if (!nameFilter) return true
      const firstname = user.firstname.toLowerCase()
      const lastname = user.lastname.toLowerCase()

      return firstname.includes(debouncedName.toLowerCase()) || lastname.includes(debouncedName.toLowerCase())
    })

    const byAccess = byName.filter(user =>
      Object.keys(user.access)
        .map(p => programmeCodesAndNames.get(p))
        .join(', ')
        .toString()
        .toLocaleLowerCase()
        .includes(accessFilter.toLocaleLowerCase())
    )
    return byAccess
  }

  const getCustomHeader = ({ name, width, field, sortable = true }) => {
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
      <Table.HeaderCell onClick={sortHandler} style={sortable ? { cursor: 'pointer' } : {}} width={width}>
        {name} {sortable && <Icon name="sort" />}
      </Table.HeaderCell>
    )
  }

  return (
    <>
      <div className="user-filter-container">
        <Input
          className="user-filter"
          value={nameFilter}
          onChange={(e, { value }) => setNameFilter(value)}
          icon="search"
          iconPosition="left"
          placeholder={translations.searchByName[lang]}
        />
        <Input
          className="user-filter"
          value={accessFilter}
          onChange={(e, { value }) => setAccessFilter(value)}
          icon="users"
          iconPosition="left"
          placeholder={translations.filterByAccess[lang]}
        />
      </div>
      <Table celled compact stackable>
        <Table.Header className="sticky-header">
          <Table.Row>
            {getCustomHeader({ name: translations.name[lang], width: 2, field: 'lastname' })}
            {getCustomHeader({ name: translations.userId[lang], width: 1, field: 'uid' })}
            {getCustomHeader({ name: translations.access[lang], width: 6, field: 'access', sortable: true })}
            {getCustomHeader({ name: translations.userGroup[lang], width: 2, field: 'userGroup' })}
            {getCustomHeader({ name: translations.lastLogin[lang], width: 2, field: 'lastLogin', sortable: true })}
            {getCustomHeader({
              name: translations.specialGroup[lang],
              width: 2,
              field: 'specialGroup',
              sortable: true,
            })}
            {isAdmin(user) && getCustomHeader({ name: 'Hijack', width: 1, field: 'hijackUser', sortable: false })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredUsers().map(u => (
            <User
              data-cy={`user-${u.uid}`}
              lang={lang}
              user={u}
              key={u.id}
              programmeCodesAndNames={programmeCodesAndNames}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
