import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Header, Button, Segment } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAllDeadlines, createDeadline, deleteDeadline } from 'Utilities/redux/deadlineReducer'
import { registerLocale } from 'react-datepicker'
import { fi, enGB, sv } from 'date-fns/locale'

export default function OspaModule() {
  const [newDate, setNewDate] = useState(null)
  const existingDeadlines = useSelector(({ deadlines }) => deadlines.existingDeadlines)
  const languageCode = useSelector((state) => state.language)
  const isAdmin = useSelector(({ currentUser }) => currentUser.data.admin)
  const dispatch = useDispatch()
  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  useEffect(() => {
    dispatch(getAllDeadlines())
  }, [])

  const translations = {
    deadlineControls: {
      en: 'Deadline controls',
      fi: 'Määräaika asetukset',
      se: '',
    },
    selectNewDeadline: {
      en: 'Select new deadline',
      fi: 'Valitse uusi määräaika',
      se: '',
    },
    addSelectedDeadline: {
      en: 'Add selected deadline',
      fi: 'Lisää valittu määräaika',
      se: '',
    },
    upcomingDeadlines: {
      en: 'Upcoming deadlines:',
      fi: 'Seuraavat määräajat:',
      se: '',
    },
    noUpcomingDeadlines: {
      en: 'No upcoming deadlines.',
      fi: 'Ei tulevia määräaikoja',
      se: '',
    },
    deleteThisDeadline: {
      en: 'Delete this deadline',
      fi: 'Poista tämä määräaika',
      se: '',
    },
  }

  const handleDeadlineSave = () => {
    dispatch(createDeadline(newDate.toLocaleDateString()))
    setNewDate(null)
  }

  const handleDelete = (id) => {
    dispatch(deleteDeadline(id))
  }

  if (!isAdmin) return null

  return (
    <Segment style={{ width: '500px', zIndex: '3', margin: '1em' }}>
      <Header as="h4" style={{ textAlign: 'center' }}>
        {translations['deadlineControls'][languageCode]}
      </Header>
      <DatePicker
        dateFormat="dd.MM.yyyy"
        excludeDates={existingDeadlines.map((dl) => new Date(dl.date))}
        placeholderText={translations['selectNewDeadline'][languageCode]}
        minDate={new Date()}
        selected={newDate}
        onChange={setNewDate}
        locale={languageCode}
      />
      <Button primary compact size="mini" disabled={!newDate} onClick={handleDeadlineSave}>
        {translations['addSelectedDeadline'][languageCode]}
      </Button>

      <div style={{ marginTop: '1em' }} className="existingDeadlines">
        <Header as="h5">{translations['upcomingDeadlines'][languageCode]}</Header>
        {existingDeadlines.length === 0 && (
          <span>{translations['noUpcomingDeadlines'][languageCode]}</span>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }} className="upcoming-deadlines">
          {existingDeadlines
            .filter((dl) => !dl.passed)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((deadline, index) => {
              const { date, id } = deadline
              const dateObj = new Date(date)
              const day = dateObj.getDate()
              const month = dateObj.getMonth() + 1
              const year = dateObj.getFullYear()

              return (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}
                  key={id}
                >
                  <span style={index === 0 ? { color: 'red' } : {}}>
                    {`${day}.${month}.${year}`}
                  </span>
                  <Button
                    negative={true}
                    compact={true}
                    size="mini"
                    onClick={() => handleDelete(id)}
                  >
                    {translations['deleteThisDeadline'][languageCode]}
                  </Button>
                </div>
              )
            })}
        </div>
      </div>
    </Segment>
  )
}
