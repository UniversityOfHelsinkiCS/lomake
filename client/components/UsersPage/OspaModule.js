import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Header, Button, Segment } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  createOrUpdateDeadline,
  deleteDeadline,
  getDeadline,
} from 'Utilities/redux/deadlineReducer'
import { registerLocale } from 'react-datepicker'
import { fi, enGB, sv } from 'date-fns/locale'
import { usersPageTranslations as translations } from 'Utilities/translations'


export default function OspaModule() {
  const [newDate, setNewDate] = useState(null)
  const lang = useSelector((state) => state.language)
  const nextDeadline = useSelector(({ deadlines }) => deadlines.nextDeadline)
  const isAdmin = useSelector(({ currentUser }) => currentUser.data.admin)
  const dispatch = useDispatch()
  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  useEffect(() => {
    dispatch(getDeadline())
  }, [])

  const handleDeadlineSave = () => {
    const acualDate = new Date(
      Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
    )

    dispatch(createOrUpdateDeadline(acualDate.toISOString()))
    setNewDate(null)
  }

  const handleDelete = () => {
    dispatch(deleteDeadline())
  }

  if (!isAdmin) return null

  const existingDeadlines = []

  const formatDate = (date) => {
    const temp = new Date(date)
    return `${temp.getDate()}.${temp.getMonth() + 1}.${temp.getFullYear()}`
  }

  return (
    <Segment style={{ width: '500px', zIndex: '3', margin: '1em' }}>
      <Header as="h4" style={{ textAlign: 'center' }}>
        {translations['deadlineSettings'][lang]}
      </Header>
      <DatePicker
        dateFormat="dd.MM.yyyy"
        excludeDates={existingDeadlines.map((dl) => new Date(dl.date))}
        placeholderText={translations['selectNewDeadline'][lang]}
        minDate={new Date()}
        selected={newDate}
        onChange={setNewDate}
        locale={lang}
      />
      <Button
        data-cy="updateDeadline"
        primary
        compact
        size="mini"
        disabled={!newDate}
        onClick={handleDeadlineSave}
      >
        {translations['updateDeadline'][lang]}
      </Button>
      {nextDeadline && (
        <Button data-cy="deleteDeadline" onClick={handleDelete} negative compact size="mini">
          {translations['deleteThisDeadline'][lang]}
        </Button>
      )}

      <Header as="h5">{translations['nextDeadline'][lang]}</Header>
      {!nextDeadline && (
        <div data-cy="noNextDeadline">{translations['noDeadlineSet'][lang]}</div>
      )}
      {nextDeadline && <div data-cy="nextDeadline">{formatDate(nextDeadline.date)}</div>}
    </Segment>
  )
}
