import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Button, Header, Select, Segment } from 'semantic-ui-react'
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
import { getYearsUserHasAccessToAction } from 'Utilities/redux/currentUserReducer'
import { deleteDraftYear, getDraftYear, setDraftYear } from 'Utilities/redux/draftYearReducer'
import { colors } from 'Utilities/common'


const DeadlineSetting = () => {
  const [newDate, setNewDate] = useState(null)
  const [newDraftYear, setNewDraftYear] = useState(null)
  const [yearOptions, setYearOptions] = useState([])
  const lang = useSelector((state) => state.language)
  const nextDeadline = useSelector(({ deadlines }) => deadlines.nextDeadline)
  const isAdmin = useSelector(({ currentUser }) => currentUser.data.admin)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const draftYear = useSelector(({ draftYear }) => draftYear.data)
  const dispatch = useDispatch()

  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  useEffect(() => {
    dispatch(getDeadline())
    dispatch(getDraftYear())
    const years = getYearsUserHasAccessToAction(currentUser)
    const options = years.map((y) => {
      return {
        key: y,
        value: y,
        text: y,
      }
    })
    setYearOptions(options)
  }, [currentUser])

  const handleDeadlineSave = () => {
    const acualDate = new Date(
      Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
    )
    dispatch(createOrUpdateDeadline(acualDate.toISOString()))
    setNewDate(null)
    setNewDraftYear(null)
  }

  const handleDelete = () => {
    dispatch(deleteDeadline())
    dispatch(deleteDraftYear())
    setNewDate(null)
    setNewDraftYear(null)
  }

  if (!isAdmin) return null

  const existingDeadlines = []

  const formatDate = (date) => {
    const temp = new Date(date)
    return `${temp.getDate()}.${temp.getMonth() + 1}.${temp.getFullYear()}`
  }

  return (
      <Segment>
        <div style={{ margin: '1em 0em 3em 0em'}}>
          <Header as="h3">
            {translations.selectNewDeadline[lang]}
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
          <Header as="h4">{translations['nextDeadline'][lang]}
            {nextDeadline
              ? <span style={{ color: colors.blue }} data-cy="nextDeadline">{formatDate(nextDeadline.date)}</span>
              : <span style={{ color: colors.red }} data-cy="noNextDeadline">{translations['noDeadlineSet'][lang]}</span>
            }        
          </Header>

        </div>
        <div style={{ margin: '1em 0em'}}>
        <Header as="h3">
          {translations.selectDraftYear[lang]}
        </Header>
        <Select
          placeholder='Select year'
          options={yearOptions}
          value={newDraftYear}
          disabled={!nextDeadline}
          onChange={(e, { value }) => setNewDraftYear(value)}
        />
        <Button
          data-cy="updateDraftYear"
          primary
          compact
          size="mini"
          disabled={!newDraftYear}
          onClick={() => dispatch(setDraftYear(newDraftYear))}
        >
          {translations.updateDraftYear[lang]}
        </Button>
        <Header as="h4">{translations.answersSavedForYear[lang]} 
        {draftYear && nextDeadline
          ? <span style={{ color: colors.blue }} data-cy="draftYear">{draftYear}</span>
          : <span style={{ color: colors.red }} data-cy="noDraftYear">{translations.noDraftYear[lang]}</span>
        }
        </Header>
        </div>
      </Segment>
  )
}

export default DeadlineSetting
