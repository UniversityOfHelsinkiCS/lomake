import React, { useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Button, Header, Select, Segment } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'
import { setDeadlineAndDraftYear, deleteDeadlineAndDraftYear } from 'Utilities/redux/deadlineReducer'
import { fi, enGB, sv } from 'date-fns/locale'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { getYearsUserHasAccessToAction } from 'Utilities/redux/currentUserReducer'
import { colors } from 'Utilities/common'

const DeadlineSetting = () => {
  const [newDate, setNewDate] = useState(null)
  const [newDraftYear, setNewDraftYear] = useState(null)
  const [yearOptions, setYearOptions] = useState([])
  const lang = useSelector(state => state.language)
  const nextDeadline = useSelector(({ deadlines }) => deadlines.nextDeadline)
  const draftYear = useSelector(({ deadlines }) => deadlines.draftYear)
  const isAdmin = useSelector(({ currentUser }) => currentUser.data.admin)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const dispatch = useDispatch()

  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  useEffect(() => {
    const years = getYearsUserHasAccessToAction(currentUser)
    const options = years.map(y => {
      return {
        key: y,
        value: y,
        text: y,
      }
    })
    setYearOptions(options)
  }, [currentUser])

  const handleDeadlineSave = () => {
    const acualDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()))
    dispatch(setDeadlineAndDraftYear({ deadline: acualDate.toISOString(), draftYear: newDraftYear }))
    setNewDate(null)
    setNewDraftYear(null)
  }

  const handleDelete = () => {
    dispatch(deleteDeadlineAndDraftYear())
    setNewDate(null)
    setNewDraftYear(null)
  }

  if (!isAdmin) return null

  const existingDeadlines = []

  const formatDate = date => {
    const temp = new Date(date)
    return `${temp.getDate()}.${temp.getMonth() + 1}.${temp.getFullYear()}`
  }

  return (
    <Segment>
      <div style={{ margin: '1em 0em 3em 0em' }}>
        <Header as="h4">{translations.selectNewDeadline[lang]}</Header>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          excludeDates={existingDeadlines.map(dl => new Date(dl.date))}
          placeholderText={translations.selectNewDeadline[lang]}
          minDate={new Date()}
          selected={newDate}
          onChange={setNewDate}
          locale={lang}
        />
        <Header as="h4">{translations.selectDraftYear[lang]}</Header>
        <Select
          data-cy="draft-year-selector"
          placeholder="Select year"
          options={yearOptions}
          value={newDraftYear}
          disabled={!newDate}
          onChange={(e, { value }) => setNewDraftYear(value)}
        />
      </div>
      <Button
        data-cy="updateDeadline"
        primary
        compact
        size="mini"
        disabled={!newDate || !newDraftYear}
        onClick={handleDeadlineSave}
      >
        {translations.updateDeadline[lang]} and draft year
      </Button>
      {nextDeadline && (
        <Button data-cy="deleteDeadline" onClick={handleDelete} negative compact size="mini">
          {translations.deleteThisDeadline[lang]}
        </Button>
      )}
      <Button data-cy="discardDrafts" compact size="mini" disabled={!draftYear || !nextDeadline}>
        Scratch that
      </Button>
      <div style={{ margin: '1em 0em' }}>
        <p>
          <b>
            {translations.nextDeadline[lang]}
            <span style={{ color: nextDeadline ? colors.blue : colors.red }} data-cy="nextDeadline">
              {nextDeadline ? (
                formatDate(nextDeadline.date)
              ) : (
                <span data-cy="noNextDeadline">{translations.noDeadlineSet[lang]}</span>
              )}
            </span>
          </b>
        </p>
        <p>
          <b>
            {translations.answersSavedForYear[lang]}
            <span style={{ color: nextDeadline ? colors.blue : colors.red }} data-cy="draftYear">
              {draftYear ? draftYear.year : translations.noDraftYear[lang]}
            </span>
          </b>
        </p>
      </div>
    </Segment>
  )
}

export default DeadlineSetting
