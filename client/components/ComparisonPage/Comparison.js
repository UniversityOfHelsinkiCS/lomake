import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Grid, Radio } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import SingleProgramPieChart from './SingleProgramPieChart'
import PieChart from './PieChart'
import LevelFilter from 'Components/Generic/LevelFilter'
import YearSelector from 'Components/Generic/YearSelector'
import {
  internationalProgrammes as international,
} from 'Utilities/common'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import useDebounce from 'Utilities/useDebounce'
import faculties from '../../facultyTranslations'
import './ComparisonPage.scss'


const Comparison = ({ 
  questionsList,
  usersProgrammes,
  allAnswers,
  facultiesByKey,
}) => {
  const lang = useSelector((state) => state.language)
  const user = useSelector((state) => state.currentUser.data)
  const level = useSelector((state) => state.programmeLevel)
  const year = useSelector((state) => state.form.selectedYear)
  const [compared, setCompared] = useState(faculties[lang][1].value)
  const [chosen, setChosen] = useState('')
  const debouncedChosen = useDebounce(chosen, 200)
  const [showEmpty, setShowEmpty] = useState(true)
  const history = useHistory()

  if (!usersProgrammes || !allAnswers) return <></>

  if (!user.admin && usersProgrammes.length <= 5) {
    history.push('/')
  }

  const handleChosenChange = (e, { value }) => {
    setChosen(value)
  }

  const handleComparedChange = (e, { value }) => {
    setCompared(value)
  }

  const programmeFaculty = () => {

    if (!usersProgrammes) return ''

    const filtered = usersProgrammes.find((p) => {
      const prog = p.name[lang] ? p.name[lang] : p.name['en']
      return prog.toLowerCase().includes(debouncedChosen.toLowerCase())
    })
    if (!filtered) return ''
    const facultyCode = facultiesByKey.get(filtered.key)
    const faculty = faculties[lang].find((f) => f.key == facultyCode)
    if (!faculty) return translations.noFaculty[lang] 
    return faculty.text
  }

  const comparisonFaculty = faculties[lang].find((f) => f.value === compared)

  const chosenAnswers = (question) => {
    if (!allAnswers || !chosen) return []
    const answers = allAnswers.get(question.id)
    if (answers) return answers.filter((a) => a.name == chosen)
    return []
  }

  const filteredProgrammes = () => {

    if (!usersProgrammes) return []

    const filteredByFaculty = usersProgrammes.filter((p) => {
      if (compared === 'allFaculties') return usersProgrammes
      return facultiesByKey.get(p.key) === compared
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

  const programmes = filteredProgrammes()
  
  const comparisonAnswers = (question) => {
    if (!programmes || !allAnswers) return []
    const filteredKeys = programmes.map((p) => p.key)
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
            <div className="comparison-filter">
              <label>{translations.comparedProgrammes[lang]}</label>
              <Dropdown
                fluid
                selection
                value={compared}
                onChange={handleComparedChange}
                options={faculties ? faculties[lang] : []}
                data-cy="faculty-filter"
              />
              <small>{translations.noAccessToAll[lang]}</small>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="comparison-toggle">
              <Radio
                checked={showEmpty}
                onChange={() => setShowEmpty(!showEmpty)}
                label={translations.emptyAnswers[lang]}
                toggle
              />
            </div>
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
                    programmeFaculty={programmeFaculty()}
                    showEmpty={showEmpty}
                  />
                )
              )}
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="comparison-smiley-grid">
              {questionsList.map((question) =>
                (comparisonAnswers(question) && !(question.no_light) &&
                  <PieChart
                    key={question.id}
                    question={question}
                    showEmpty={showEmpty}
                    answers={comparisonAnswers(question)}
                    chosenProgrammes={programmes ? programmes : []}
                    faculty={comparisonFaculty ? comparisonFaculty.text : ''}
                    allProgrammes={programmes ? programmes : ''}
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
                      chosenProgrammes={usersProgrammes ? usersProgrammes : []}
                      faculty={translations.university[lang]}
                      allProgrammes={usersProgrammes ? usersProgrammes : []}
                      university
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