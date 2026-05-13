/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Switch,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { sortedItems, colors } from '../../util/common'
import './UsersPage.scss'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'

const TempAccessTable = ({ programmes, lang, handleEdit, handleDelete }) => {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(false)
  const [sorter, setSorter] = useState('')
  const [reverse, setReverse] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const allUsers = useSelector(state => state.users.data)
  const users = useMemo(() => allUsers.filter(u => u.tempAccess.length > 0), [allUsers])

  const getCustomHeader = ({ name, pctWidth, field, sortable = true }) => {
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
            onClick={sortHandler}
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

  const oldAccess = date => {
    const end = new Date(date)
    end.setHours(23, 59, 59)
    if (end >= new Date()) {
      return false
    }
    return true
  }

  const handleConfirmOpen = row => {
    setToDelete(row)
    setConfirm(true)
  }

  const handleConfirm = () => {
    handleDelete(toDelete)
    setConfirm(false)
    setToDelete(null)
  }

  const data = useMemo(() => {
    return users.reduce((acc, curr) => {
      const rows = curr.tempAccess.flatMap(({ programme, writingRights, endDate }) => {
        if (showAll || (!showAll && !oldAccess(endDate))) {
          return {
            firstname: curr.firstname,
            lastname: curr.lastname,
            uid: curr.uid,
            programme,
            writingRights,
            endDate,
            progName: programmes.find(p => p.key === programme)?.name[lang],
            email: curr.email,
          }
        }
        return []
      })
      return [...acc, ...rows]
    }, [])
  }, [users])

  const sortedUsersToShow = sortedItems(data, sorter)

  if (reverse) sortedUsersToShow.reverse()

  return (
    <div className="temp-access-table-container">
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', my: 3 }} />
      <Typography variant="h3">{t('users:tempAccesses')} </Typography>
      <Switch checked={showAll} onChange={e => setShowAll(e.target.checked)} /> {t('users:expired')}
      <Table
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
        <TableHead className="sticky-header">
          <TableRow>
            {getCustomHeader({ name: t('users:name'), width: 2, field: 'lastname' })}
            {getCustomHeader({ name: t('users:userId'), width: 1, field: 'uid' })}
            {getCustomHeader({ name: t('programmeHeader'), width: 6, field: 'progName' })}
            {getCustomHeader({ name: t('users:writingRight'), width: 1, field: 'writingRights', sortable: false })}
            {getCustomHeader({ name: t('users:endsIn'), width: 2, field: 'endDate', sortable: true })}
            <TableCell
              sx={{
                backgroundColor: colors.background_gray,
                fontWeight: 700,
              }}
            >
              {t('edit')}
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: colors.background_gray,
                fontWeight: 700,
              }}
            >
              {t('delete')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedUsersToShow.map(row => (
            <TableRow key={`${row.uid}-${row.programme}-row`}>
              <TableCell>
                {row.firstname} {row.lastname}
              </TableCell>
              <TableCell>{row.uid}</TableCell>
              <TableCell data-cy={`${row.uid}-${row.programme}-programme`}>{row.progName}</TableCell>
              <TableCell data-cy={`${row.uid}-${row.programme}-writing-right`}>
                {row.writingRights ? <CheckIcon color="success" /> : null}
              </TableCell>
              <TableCell>{moment(row.endDate).format('DD.MM.YYYY')}</TableCell>
              <TableCell data-cy="edit-access">
                <Button onClick={() => handleEdit(row)}>
                  <EditDocumentIcon name="edit" />
                </Button>
              </TableCell>
              <TableCell data-cy="delete-access">
                <Button onClick={() => handleConfirmOpen(row)}>
                  <DeleteIcon name="delete" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog onClose={() => setConfirm(false)} open={confirm}>
        <DialogContent>
          <DialogContentText>
            {t('users:confirm', {
              firstname: toDelete?.firstname,
              lastname: toDelete?.lastname,
              progName: toDelete?.progName,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>{t('cancel')}</Button>
          <Button color="primary" onClick={handleConfirm}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default TempAccessTable
