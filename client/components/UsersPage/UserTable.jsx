/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  CircularProgress,
  Button,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  TableRow,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import SwapVertIcon from '@mui/icons-material/SwapVert'

import User from './User'
import useDebounce from '../../util/useDebounce'
import { sortedItems, colors } from '../../util/common'
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

  if (users.pending || !users.data || !usersProgrammes || isFetching) return <CircularProgress />

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
    const active = sorter === field
    const handleSort = () => {
      if (!sortable) return
      if (active) setReverse(!reverse)
      else {
        setReverse(false)
        setSorter(field)
      }
    }
    const pctWidth = typeof width === 'number' ? `${(width / 16) * 100}%` : width

    return (
      <TableCell
        sx={{
          width: pctWidth,
          backgroundColor: colors.background_gray,
          fontWeight: 700,
        }}
      >
        <span>{name}</span>
        {sortable ? (
          <Button
            aria-label={`Sort by ${name}`}
            onClick={handleSort}
            sx={{
              color: 'inherit',
              minWidth: 0,
              marginLeft: 0.5,
              padding: 0,
              textTransform: 'none',
              verticalAlign: 'middle',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <SwapVertIcon sx={{ color: 'black', fontSize: 20 }} />
          </Button>
        ) : null}
      </TableCell>
    )
  }

  return (
    <div style={{ overflowX: 'scroll' }}>
      <div className="user-filter-container">
        <TextField
          className="user-filter"
          label={t('users:searchByName')}
          onChange={e => setNameFilter(e.target.value)}
          value={nameFilter}
        />
        <TextField
          className="user-filter"
          label={t('users:filterByAccess')}
          onChange={e => setAccessFilter(e.target.value)}
          value={accessFilter}
        />
      </div>
      <TableContainer component={Paper}>
        <Table
          stickyHeader
          sx={{
            tableLayout: 'fixed',
            width: '100%',
            '& .MuiTableCell-root': {
              borderRight: 1,
              borderColor: 'divider',
            },
            '& .MuiTableCell-root:last-of-type': {
              borderRight: 0,
            },
          }}
        >
          <TableHead>
            <TableRow>
              {getCustomHeader({ name: t('users:name'), width: 2, field: 'lastname' })}
              {getCustomHeader({ name: t('users:userId'), width: 3, field: 'uid' })}
              {getCustomHeader({ name: t('users:access'), width: 5, field: 'access', sortable: true })}
              {getCustomHeader({ name: t('users:userGroup'), width: 3, field: 'userGroup' })}
              {getCustomHeader({ name: t('users:lastLogin'), width: 2, field: 'lastLogin', sortable: true })}
              {getCustomHeader({
                name: t('users:specialGroup'),
                width: 3,
                field: 'specialGroup',
                sortable: true,
              })}
              {getCustomHeader({ name: t('users:role'), width: 2.5, field: 'role', sortable: false })}
              {getCustomHeader({ name: 'IAM access', width: 4, field: 'IAMs', sortable: false })}
              {isAdmin(user) && getCustomHeader({ name: 'Hijack', width: 2, field: 'hijackUser', sortable: false })}
            </TableRow>
          </TableHead>
          <TableBody>
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
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
