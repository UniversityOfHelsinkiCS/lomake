import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Input, Icon, Loader, Table } from 'semantic-ui-react'
import { useHistory } from 'react-router'

import AccessModal from './AccessModal'
import User from 'Components/UsersPage/User'
import useDebounce from 'Utilities/useDebounce'
import { sortedItems } from 'Utilities/common'
import { isSuperAdmin } from '../../../config/common'
import { usersPageTranslations as translations } from 'Utilities/translations'
import './UsersPage.scss'


export default () => {
  const [sorter, setSorter] = useState('')
  const [reverse, setReverse] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [accessFilter, setAccessFilter] = useState('')
  const [programmeFilter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)

  const debouncedName = useDebounce(nameFilter, 200)
  const debouncedProgramme = useDebounce(programmeFilter, 200)

  const lang = useSelector((state) => state.language)
  const users = useSelector((state) => state.users)
  const user = useSelector(({ currentUser }) => currentUser.data)
  const usersProgrammes = useSelector((state) => state.studyProgrammes.usersProgrammes)
  const history = useHistory()

  if (!user.admin) {
    history.push('/')
  }

  if (users.pending || !users.data || !usersProgrammes) return <Loader active inline="centered" />

  if (!users) return null


  let sortedUsersToShow = sortedItems(users.data, sorter)

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

  const filteredProgrammes = usersProgrammes.filter((p) => {
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
      <Table.HeaderCell
        onClick={sortHandler}
        style={sortable ? { cursor: 'pointer' } : {} }
        width={width}
      >
        {name} {sortable && <Icon name="sort" />}
      </Table.HeaderCell>
    )
  }


  const mapProgrammes = (programmes) => {
    let programmeMap = new Map()
    programmes.forEach((p) => programmeMap.set(p.key, p.name[lang]))
    return programmeMap
  }

  let programmeCodesAndNames = mapProgrammes(usersProgrammes)

  return (
    <>
      {modalData && (
        <AccessModal
          user={sortedUsersToShow.find((u) => u.id === modalData.id)}
          setModalData={setModalData}
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
        <Table.Header>
          <Table.Row>
            {getCustomHeader({ name: translations.name[lang], width: 2, field: "lastname" })}
            {getCustomHeader({ name: translations.userId[lang], width: 1, field: "uid" })}
            {getCustomHeader({ name: translations.access[lang], width: 6, field: "access", sortable: false })}
            {getCustomHeader({ name: translations.userGroup[lang], width: 6, field: "userGroup" })}
            {getCustomHeader({ name: translations.editUser[lang], width: 1, field: "editUser", sortable: false})}
            {isSuperAdmin(user.uid) && getCustomHeader({ name: "Hijack", width: 1, field: "deleteUser", sortable: false })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredUsers().map((u) => (
            <User
              lang={lang}
              user={u}
              key={u.id}
              setModalData={setModalData}
              programmeCodesAndNames={programmeCodesAndNames}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
