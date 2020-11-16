import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Grid, Radio } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import SingleProgramPieChart from './SingleProgramPieChart'
import PieChart from './PieChart'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import YearSelector from 'Components/Generic/YearSelector'
import { internationalProgrammes as international } from 'Utilities/common'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import facultyNames from '../../facultyTranslations'
import './ComparisonPage.scss'

const CompareByFaculty = ({ questionsList, usersProgrammes, allAnswers }) => {
  const lang = useSelector((state) => state.language)
  const { companion, level, year, faculty } = useSelector(({ filters }) => filters)
  const user = useSelector((state) => state.currentUser.data)
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
    const searched = usersProgrammes.find((p) => {
      const prog = p.name[lang] ? p.name[lang] : p.name['en']
      return prog === chosen
    })
    if (!searched) return ''

    const faculty = facultyNames[lang].find((f) => f.key == searched.primaryFaculty.code)
    if (!faculty) return ''

    return faculty.text
  }

  const comparedFaculty = facultyNames[lang].find((f) => f.value === faculty)

  const chosenAnswers = (question) => {
    if (!allAnswers || !chosen) return []
    const answers = allAnswers.get(question.id)
    if (answers) return answers.filter((a) => a.name == chosen)
    return []
  }

  const filteredProgrammes = () => {
    if (!usersProgrammes) return []

    const filteredByFaculty = usersProgrammes.filter((p) => {
      if (faculty === 'allFaculties') return true
      if (companion) {
        const companionFaculties = p.companionFaculties.map((f) => f.code)
        if (companionFaculties.includes(faculty)) return true
        else return p.primaryFaculty.code === faculty
      }
      return p.primaryFaculty.code === faculty
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

  const options = usersProgrammes.map((p) => ({
    key: p.key,
    value: p.name[lang] ? p.name[lang] : p.name['en'],
    text: p.name[lang] ? p.name[lang] : p.name['en'],
  }))

  return (
    <div className="comparison-container">
      <Grid>
        <Grid.Column className="comparison-center-header" width={16}>
          {year} - {translations.reportHeader['byFaculty'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      <Grid stackable doubling padded columns={user.admin ? 3 : 2}>
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
            {faculty !== 'allFaculties'
              && (level === 'doctor'
                || level === 'master'
                || level === 'bachelor')
              && <CompanionFilter />}
          </Grid.Column>
          <Grid.Column>
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
        className="comparison-color-grid"
        centered
        stackable
        doubling
        relaxed
        columns={user.admin ? 3 : 2}
      >
        <Grid.Column>
          {questionsList.map(
            (question) =>
              chosenAnswers(question) &&
              !question.no_color && (
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
        </Grid.Column>
        <Grid.Column>
          {questionsList.map(
            (question) =>
              comparedAnswers(question) &&
              !question.no_color && (
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
        </Grid.Column>
        {user.admin && (
          <Grid.Column>
            {questionsList.map(
              (question) =>
                allAnswers.get(question.id) &&
                !question.no_color && (
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
          </Grid.Column>
        )}
      </Grid>
    </div>
  )
}

export default CompareByFaculty
