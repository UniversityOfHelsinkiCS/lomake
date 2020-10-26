import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Grid, Radio } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import SingleProgramPieChart from './SingleProgramPieChart'
import PieChart from './PieChart'
import LevelFilter from 'Components/Generic/LevelFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import YearSelector from 'Components/Generic/YearSelector'
import {
  internationalProgrammes as international,
} from 'Utilities/common'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import faculties from '../../facultyTranslations'
import './ComparisonPage.scss'


const Comparison = ({ 
  questionsList,
  usersProgrammes,
  allAnswers,
  facultiesByKey,
}) => {
  const faculty = useSelector((state) => state.faculties.selectedFaculty)
  const lang = useSelector((state) => state.language)
  const level = useSelector((state) => state.programmeLevel)
  const user = useSelector((state) => state.currentUser.data)
  const year = useSelector((state) => state.form.selectedYear)
  const [chosen, setChosen] = useState('')
  const [showEmpty, setShowEmpty] = useState(true)
  const history = useHistory()

  if (!usersProgrammes || !allAnswers) return <></>

  if (!user.admin && usersProgrammes.length <= 5) {
    history.push('/')
  }

  const handleChosenChange = (e, { value }) => {
    setChosen(value)
  }

  const chosenProgrammeFaculty = () => {

    if (!usersProgrammes) return ''

    const filtered = usersProgrammes.find((p) => {
      const prog = p.name[lang] ? p.name[lang] : p.name['en']
      return prog === chosen
    })
    if (!filtered) return ''
    const facultyCode = facultiesByKey.get(filtered.key)
    const faculty = faculties[lang].find((f) => f.key == facultyCode)
    if (!faculty) return translations.noFaculty[lang] 
    return faculty.text
  }

  const comparedFaculty = faculties[lang].find((f) => f.value === faculty)

  const chosenAnswers = (question) => {
    if (!allAnswers || !chosen) return []
    const answers = allAnswers.get(question.id)
    if (answers) return answers.filter((a) => a.name == chosen)
    return []
  }

  const filteredProgrammes = () => {

    if (!usersProgrammes) return []

    const filteredByFaculty = usersProgrammes.filter((p) => {
      if (faculty === 'allFaculties') return usersProgrammes
      return facultiesByKey.get(p.key) === faculty
    })  

    const filteredByLevel = filteredByFaculty.filter((p) => {
      if (level === 'allProgrammes') return true
      const prog = p.name['en'].toLowerCase()
      if (level === 'international') {
        return international.includes(p.key)
      }
      if (level === 'master') {
        return prog.includes('master') || prog.includes('degree programme')
      }
      return prog.includes(level.toString())
    })

    return filteredByLevel
  
  }

  const comparedProgrammes = filteredProgrammes()
  
  const comparedAnswers = (question) => {
    if (!comparedProgrammes || !allAnswers) return []
    const filteredKeys = comparedProgrammes.map((p) => p.key)
    const answers = allAnswers.get(question.id)
    if (answers) return answers.filter((a) => filteredKeys.includes(a.key))
    return []
  }

  const options = usersProgrammes.map((p) =>
    ({ key: p.key,
      value: p.name[lang] ? p.name[lang] : p.name['en'],
      text: p.name[lang] ? p.name[lang] : p.name['en']
    })
  )

  return (
    <div className="comparison-container">
      <Grid >
        <Grid.Column className="comparison-center-header" width={16}>
          {year} - {translations.reportHeader['comparison'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider"/>
      <Grid
        stackable
        doubling
        padded
        columns={user.admin ? 3 : 2}
      >
        <Grid.Row>
          <Grid.Column width={16}>
            <YearSelector />
            <LevelFilter comparison />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="comparison-row">
          <Grid.Column>
            <div className="comparison-filter">
              <label>{translations.chosenProgrammes[lang]}</label>
              <Dropdown
                fluid
                selection
                search
                placeholder={translations.chooseProgramme[lang]}
                value={chosen}
                onChange={handleChosenChange}
                options={usersProgrammes ? options : []}
                data-cy="programme-filter"
              />
            </div>
          </Grid.Column>
          <Grid.Column>
            <FacultyFilter size="large" label={translations.facultyFilter[lang]} />
            <small>{translations.noAccessToAll[lang]}</small>
          </Grid.Column>
          <Grid.Column verticalAlign="bottom">
            <Radio
              className="comparison-toggle"
              checked={showEmpty}
              onChange={() => setShowEmpty(!showEmpty)}
              label={translations.emptyAnswers[lang]}
              toggle
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid
        centered
        stackable
        doubling
        columns={user.admin ? 3 : 2}
      >
        <Grid.Row>
          <Grid.Column>
            <div className="comparison-smiley-grid">
              {questionsList.map((question) =>
                (chosenAnswers(question) && !(question.no_light) &&
                  <SingleProgramPieChart
                    key={question.id}
                    question={question}
                    answers={chosenAnswers(question)}
                    programmeName={chosen ? chosen : ''}
                    programmeFaculty={chosenProgrammeFaculty()}
                    showEmpty={showEmpty}
                  />
                )
              )}
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="comparison-smiley-grid">
              {questionsList.map((question) =>
                (comparedAnswers(question) && !(question.no_light) &&
                  <PieChart
                    key={question.id}
                    question={question}
                    showEmpty={showEmpty}
                    answers={comparedAnswers(question)}
                    faculty={comparedFaculty ? comparedFaculty.text : ''}
                    programmes={comparedProgrammes ? comparedProgrammes : ''}
                    name="faculty"
                  />
                )
              )}
            </div>
          </Grid.Column>
          {user.admin && 
            <Grid.Column>
              <div className="comparison-smiley-grid">
                {questionsList.map((question) =>
                  (allAnswers.get(question.id) && !(question.no_light) &&
                    <PieChart
                      key={question.id}
                      question={question}
                      showEmpty={showEmpty}
                      answers={allAnswers.get(question.id)}
                      programmes={usersProgrammes ? usersProgrammes : []}
                      faculty={translations.university[lang]}
                      name="university"
                    />
                  )
                )}
              </div>
            </Grid.Column>
          }
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default Comparison