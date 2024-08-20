import React, { useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Button, Divider, Header, Select, Segment } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'
import { setDeadlineAndDraftYear, deleteDeadlineAndDraftYear } from '../../util/redux/deadlineReducer'
import { fi, enGB, sv } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { getYearsUserHasAccessToAction } from '../../util/redux/currentUserReducer'
import { colors } from '../../util/common'
import { isSuperAdmin } from '../../../config/common'
import { forms } from '../../../config/data'

const DeadlineSetting = () => {
  const { t } = useTranslation()
  const [newDate, setNewDate] = useState(null)
  const [newDraftYear, setNewDraftYear] = useState(null)
  const [yearOptions, setYearOptions] = useState([])
  const [form, setForm] = useState(null)
  const [formDeadline, setFormDeadline] = useState(null)
  const [sortedDeadlines, setSortedDeadlines] = useState([])
  const [warning, setWarning] = useState(false)
  const lang = useSelector(state => state.language)
  const allDeadlines = useSelector(({ deadlines }) => deadlines.nextDeadline)

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

  useEffect(() => {
    if (allDeadlines && allDeadlines.length > 0) {
      const formDl = allDeadlines.find(d => d.form === form)
      setFormDeadline(formDl)
    }
  }, [form])

  useEffect(() => {
    if (allDeadlines) {
      const sorted = allDeadlines.map(d => {
        return {
          form: d.form,
          date: d.date,
          name: forms.find(f => f.key === d.form)?.name,
        }
      })
      sorted.sort((a, b) => {
        return new Date(b.date - new Date(a.date))
      })
      setSortedDeadlines(sorted)
    } else {
      setSortedDeadlines([])
    }
  }, [allDeadlines])

  const formOptions = forms.map(f => {
    return {
      key: f.key,
      value: f.key,
      text: f.name,
    }
  })

  const handleDeadlineSave = () => {
    const acualDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()))
    dispatch(setDeadlineAndDraftYear({ deadline: acualDate.toISOString(), draftYear: newDraftYear, form }))
    setNewDate(null)
    setNewDraftYear(null)
    setForm(null)
    setFormDeadline(null)
  }

  const handleDelete = () => {
    dispatch(deleteDeadlineAndDraftYear({ form }))
    setNewDate(null)
    setNewDraftYear(null)
    setForm(null)
    setFormDeadline(null)
  }

  if (!isSuperAdmin(currentUser)) return null

  const formatDate = date => {
    const temp = new Date(date)
    return `${temp.getDate()}.${temp.getMonth() + 1}.${temp.getFullYear()}`
  }

  return (
    <Segment>
      <div style={{ margin: '1em 0em 3em 0em' }}>
        <Header as="h4">{t('users:selectDraftYear')}</Header>
        <Select
          data-cy="draft-year-selector"
          placeholder="Select year"
          options={yearOptions}
          value={newDraftYear}
          onChange={(e, { value }) => setNewDraftYear(value)}
        />
        <Header as="h4">{t('users:selectForm')}</Header>
        <Select
          fluid
          data-cy="form-selector"
          placeholder="Select form"
          options={formOptions}
          value={form}
          disabled={!newDraftYear}
          onChange={(e, { value }) => setForm(value)}
        />
        <Header as="h4">{t('users:selectNewDeadline')}</Header>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          placeholderText={t('users:selectNewDeadline')}
          minDate={new Date()}
          selected={newDate}
          onChange={setNewDate}
          disabled={!form}
          locale={lang}
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
        disabled={warning || !newDate || !newDraftYear || !form}
        onClick={handleDeadlineSave}
      >
        {formDeadline ? t('users:updateDeadline') : `${t('users:updateDeadline')} and draft year`}
      </Button>
      {formDeadline && form && (
        <Button data-cy="deleteDeadline" onClick={handleDelete} negative compact size="mini">
          {t('users:deleteThisDeadline')}
        </Button>
      )}
      <div style={{ margin: '1em 0em' }}>
        <p>
          <b>
            {t('users:nextDeadline')}
            <span style={{ color: formDeadline ? colors.blue : colors.red }} data-cy="nextDeadline">
              {form && formDeadline && formatDate(formDeadline.date)}
              {form && !formDeadline && <span data-cy="noNextDeadline">{t('users:noDeadlineSet')}</span>}
            </span>
          </b>
        </p>
        <div>
          <h3>
            {t('users:answersSavedForYear')}
            <span style={{ color: draftYear ? colors.blue : colors.red }} data-cy="draftYear">
              {draftYear ? draftYear.year : t('users:noDraftYear')}
            </span>
          </h3>
        </div>
      </div>
      <Divider />
      <Header as="h3">{t('users:openForms')}</Header>
      <div style={{ margin: '1em 0em' }}>
        {allDeadlines ? (
          sortedDeadlines.map(d => {
            return (
              <p data-cy={`form-${d.form}-deadline`} key={d.form}>
                {formatDate(d.date)} - {d.name} (id: {d.form})
              </p>
            )
          })
        ) : (
          <p data-cy="no-form-deadlines">{t('users:noDeadlineSet')}</p>
        )}
      </div>
    </Segment>
  )
}

export default DeadlineSetting
