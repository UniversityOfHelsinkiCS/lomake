/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Input, Icon, Loader, Table } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import User from './User'
import useDebounce from '../../util/useDebounce'
import { sortedItems } from '../../util/common'
import { isAdmin } from '../../../config/common'
import './UsersPage.scss'
import { useGetOrganisationDataQuery } from '@/client/redux/organisation'

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
  const navigate = useNavigate()
  const { data, isFetching } = useGetOrganisationDataQuery()

  if (!isAdmin(user)) {
    navigate('/')
  }

  if (users.pending || !users.data || !usersProgrammes || isFetching) return <Loader active inline="centered" />

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

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
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
        {name} {sortable ? <Icon name="sort" /> : null}
      </Table.HeaderCell>
    )
  }

  return (
    <div style={{ overflowX: 'scroll' }}>
      <div className="user-filter-container">
        <Input
          className="user-filter"
          icon="search"
          iconPosition="left"
          onChange={(e, { value }) => setNameFilter(value)}
          placeholder={t('users:searchByName')}
          value={nameFilter}
        />
        <Input
          className="user-filter"
          icon="users"
          iconPosition="left"
          onChange={(e, { value }) => setAccessFilter(value)}
          placeholder={t('users:filterByAccess')}
          value={accessFilter}
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
              data={data}
              data-cy={`user-${u.uid}`}
              key={u.id}
              lang={lang}
              programmeCodesAndNames={programmeCodesAndNames}
              user={u}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
