import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Checkbox, Confirm, Divider, Header, Icon, Table } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { sortedItems } from 'Utilities/common'
import './UsersPage.scss'

const TempAccessTable = ({ programmes, lang, handleEdit, handleDelete }) => {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(false)
  const [sorter, setSorter] = useState('')
  const [reverse, setReverse] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const users = useSelector(state => state.users.data.filter(u => u.tempAccess.length > 0))

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
      <Divider />
      <Header as="h3">{t('users:tempAccesses')} </Header>
      <Checkbox toggle label={t('users:expired')} onChange={(e, data) => setShowAll(data.checked)} checked={showAll} />
      <Table celled stackable compact>
        <Table.Header className="sticky-header">
          <Table.Row>
            {getCustomHeader({ name: t('users:name'), width: 2, field: 'lastname' })}
            {getCustomHeader({ name: t('users:userId'), width: 1, field: 'uid' })}
            {getCustomHeader({ name: t('programmeHeader'), width: 6, field: 'progName' })}
            {getCustomHeader({ name: t('users:writingRight'), width: 1, field: 'writingRights', sortable: false })}
            {getCustomHeader({ name: t('users:endsIn'), width: 2, field: 'endDate', sortable: true })}
            <Table.HeaderCell width={1}>{t('edit')}</Table.HeaderCell>
            <Table.HeaderCell width={1}>{t('delete')}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedUsersToShow.map(row => (
            <Table.Row key={`${row.uid}-${row.programme}-row`}>
              <Table.Cell>
                {row.firstname} {row.lastname}
              </Table.Cell>
              <Table.Cell>{row.uid}</Table.Cell>
              <Table.Cell data-cy={`${row.uid}-${row.programme}-programme`} style={{ display: 'flex' }}>
                {row.progName}
              </Table.Cell>
              <Table.Cell data-cy={`${row.uid}-${row.programme}-writing-right`} textAlign="center">
                {row.writingRights && <Icon name="check" color="green" />}
              </Table.Cell>
              <Table.Cell>{moment(row.endDate).format('DD.MM.YYYY')}</Table.Cell>
              <Table.Cell data-cy="edit-access" textAlign="center">
                <Icon name="edit" onClick={() => handleEdit(row)} />
              </Table.Cell>
              <Table.Cell data-cy="delete-access" textAlign="center">
                <Icon name="delete" color="red" onClick={() => handleConfirmOpen(row)} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Confirm
        open={confirm}
        content={t('users:confirm', {
          firstname: toDelete?.firstname,
          lastname: toDelete?.lastname,
          progName: toDelete?.progName,
        })}
        onCancel={() => setConfirm(false)}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default TempAccessTable
