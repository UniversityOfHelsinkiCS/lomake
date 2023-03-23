import React, { useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Button, Header, Select, Segment } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'
import { setDeadlineAndDraftYear, deleteDeadlineAndDraftYear } from 'Utilities/redux/deadlineReducer'
import { fi, enGB, sv } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { getYearsUserHasAccessToAction } from 'Utilities/redux/currentUserReducer'
import { colors } from 'Utilities/common'
import { isSuperAdmin } from '@root/config/common'

const DeadlineSetting = () => {
  const { t } = useTranslation()
  const [newDate, setNewDate] = useState(null)
  const [newDraftYear, setNewDraftYear] = useState(null)
  const [yearOptions, setYearOptions] = useState([])
  const [warning, setWarning] = useState(false)
  const lang = useSelector(state => state.language)
  const nextDeadline = useSelector(({ deadlines }) => deadlines.nextDeadline)
  const draftYear = useSelector(({ deadlines }) => deadlines.draftYear)
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

  useEffect(() => {
    if (newDraftYear && draftYear && draftYear.year !== newDraftYear) {
      setWarning(true)
    } else {
      setWarning(false)
    }
  }, [newDraftYear])

  const handleDeadlineSave = () => {
    const acualDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()))
    dispatch(setDeadlineAndDraftYear({ deadline: acualDate.toISOString(), draftYear: newDraftYear, form: 1 }))
    setNewDate(null)
    setNewDraftYear(null)
  }

  const handleDelete = () => {
    dispatch(deleteDeadlineAndDraftYear({ form: 1 }))
    setNewDate(null)
    setNewDraftYear(null)
  }

  if (!isSuperAdmin(currentUser)) return null

  const existingDeadlines = []

  const formatDate = date => {
    const temp = new Date(date)
    return `${temp.getDate()}.${temp.getMonth() + 1}.${temp.getFullYear()}`
  }

  return (
    <Segment>
      <div style={{ margin: '1em 0em 3em 0em' }}>
        <Header as="h4">{t('users:selectNewDeadline')}</Header>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          excludeDates={existingDeadlines.map(dl => new Date(dl.date))}
          placeholderText={t('users:selectNewDeadline')}
          minDate={new Date()}
          selected={newDate}
          onChange={setNewDate}
          locale={lang}
        />
        <Header as="h4">{t('users:selectDraftYear')}</Header>
        <Select
          data-cy="draft-year-selector"
          placeholder="Select year"
          options={yearOptions}
          value={newDraftYear}
          disabled={!newDate}
          onChange={(e, { value }) => setNewDraftYear(value)}
        />
      </div>
      {warning && (
        <p>
          <b>
            <span data-cy="previousDeadline-warning" className="deadline-warning">
              {t('users:deadlineWarning')}
            </span>
          </b>
        </p>
      )}
      <Button
        data-cy="updateDeadline"
        primary
        compact
        size="mini"
        disabled={warning || !newDate || !newDraftYear}
        onClick={handleDeadlineSave}
      >
        {t('users:updateDeadline')} and draft year
      </Button>
      {nextDeadline && (
        <Button data-cy="deleteDeadline" onClick={handleDelete} negative compact size="mini">
          {t('users:deleteThisDeadline')}
        </Button>
      )}
      <div style={{ margin: '1em 0em' }}>
        <p>
          <b>
            {t('users:nextDeadline')}
            <span style={{ color: nextDeadline ? colors.blue : colors.red }} data-cy="nextDeadline">
              {nextDeadline ? (
                formatDate(nextDeadline.date)
              ) : (
                <span data-cy="noNextDeadline">{t('users:noDeadlineSet')}</span>
              )}
            </span>
          </b>
        </p>
        <p>
          <b>
            {t('users:answersSavedForYear')}
            <span style={{ color: nextDeadline ? colors.blue : colors.red }} data-cy="draftYear">
              {draftYear ? draftYear.year : t('users:noDraftYear')}
            </span>
          </b>
        </p>
      </div>
    </Segment>
  )
}

export default DeadlineSetting
