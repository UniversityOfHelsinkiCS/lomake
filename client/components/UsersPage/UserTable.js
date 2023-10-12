import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Input, Icon, Loader, Table } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

import User from 'Components/UsersPage/User'
import useDebounce from 'Utilities/useDebounce'
import { sortedItems } from 'Utilities/common'
import { isAdmin } from '@root/config/common'
import './UsersPage.scss'

export default () => {
  const [sorter, setSorter] = useState('')
  const [reverse, setReverse] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [accessFilter, setAccessFilter] = useState('')

  const debouncedName = useDebounce(nameFilter, 200)

  const { t } = useTranslation()
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
        .includes(accessFilter.toLocaleLowerCase()),
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
    <div style={{ overflowX: 'scroll' }}>
      <div className="user-filter-container">
        <Input
          className="user-filter"
          value={nameFilter}
          onChange={(e, { value }) => setNameFilter(value)}
          icon="search"
          iconPosition="left"
          placeholder={t('users:searchByName')}
        />
        <Input
          className="user-filter"
          value={accessFilter}
          onChange={(e, { value }) => setAccessFilter(value)}
          icon="users"
          iconPosition="left"
          placeholder={t('users:filterByAccess')}
        />
      </div>
      <Table celled compact stackable>
        <Table.Header className="sticky-header">
          <Table.Row>
            {getCustomHeader({ name: t('users:name'), width: 2, field: 'lastname' })}
            {getCustomHeader({ name: t('users:userId'), width: 1, field: 'uid' })}
            {getCustomHeader({ name: t('users:access'), width: 6, field: 'access', sortable: true })}
            {getCustomHeader({ name: t('users:userGroup'), width: 2, field: 'userGroup' })}
            {getCustomHeader({ name: t('users:lastLogin'), width: 2, field: 'lastLogin', sortable: true })}
            {getCustomHeader({
              name: t('users:specialGroup'),
              width: 2,
              field: 'specialGroup',
              sortable: true,
            })}
            {getCustomHeader({ name: t('users:role'), width: 2, field: 'role', sortable: false })}
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
    </div>
  )
}
