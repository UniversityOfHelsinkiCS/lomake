import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Input, Icon, Loader, Table } from 'semantic-ui-react'
import { useHistory } from 'react-router'

import User from 'Components/UsersPage/User'
import NewUserForm from 'Components/UsersPage/NewUserForm'
import CustomModal from 'Components/Generic/CustomModal'
import useDebounce from 'Utilities/useDebounce'
import { sortedItems } from 'Utilities/common'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { isAdmin, isSuperAdmin, iamsInUse } from '@root/config/common'
import AccessModal from './AccessModal'
import './UsersPage.scss'

export default () => {
  const [sorter, setSorter] = useState('')
  const [reverse, setReverse] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [accessFilter, setAccessFilter] = useState('')
  const [programmeFilter, setFilter] = useState('')
  const [editUserFormData, setEditUserFormData] = useState(null)
  const [showNewUserForm, setShowNewUserForm] = useState(false)

  const debouncedName = useDebounce(nameFilter, 200)
  const debouncedProgramme = useDebounce(programmeFilter, 200)

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

  const filteredProgrammes = usersProgrammes.filter(p => {
    if (programmeFilter === '') return false
    const prog = p.name[lang]
    return prog.toLowerCase().includes(debouncedProgramme.toLowerCase())
  })

  const handleSearch = ({ target }) => {
    const { value } = target
    setFilter(value)
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

  const mapProgrammes = programmes => {
    const programmeMap = new Map()
    programmes.forEach(p => programmeMap.set(p.key, p.name[lang]))
    return programmeMap
  }

  let programmeCodesAndNames = mapProgrammes(usersProgrammes)

  return (
    <>
      {showNewUserForm && (
        <CustomModal
          closeModal={() => setShowNewUserForm(false)}
          children={<NewUserForm closeModal={() => setShowNewUserForm(false)} />}
        />
      )}
      {editUserFormData && (
        <AccessModal
          user={sortedUsersToShow.find(u => u.id === editUserFormData.id)}
          setModalData={setEditUserFormData}
          handleSearch={handleSearch}
          programmeFilter={programmeFilter}
          onEmpty={() => setFilter('')}
          lang={lang}
          filteredProgrammes={filteredProgrammes}
          programmeCodesAndNames={programmeCodesAndNames}
        />
      )}
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
        {!iamsInUse && (
          <Button
            data-cy="add-user-button"
            style={{ alignSelf: 'right', marginLeft: 'auto' }}
            onClick={() => setShowNewUserForm(true)}
            color="blue"
          >
            {translations.addUser[lang]}
          </Button>
        )}
      </div>
      <Table celled compact stackable>
        <Table.Header>
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
            {!iamsInUse &&
              getCustomHeader({ name: translations.editUser[lang], width: 1, field: 'editUser', sortable: false })}
            {isSuperAdmin(user) && getCustomHeader({ name: 'Hijack', width: 1, field: 'deleteUser', sortable: false })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredUsers().map(u => (
            <User
              data-cy={`user-${u.uid}`}
              lang={lang}
              user={u}
              key={u.id}
              setModalData={setEditUserFormData}
              programmeCodesAndNames={programmeCodesAndNames}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
