import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Grid, Radio } from 'semantic-ui-react'
import SingleProgramPieChart from './SingleProgramPieChart'
import PieChart from './PieChart'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import YearSelector from 'Components/Generic/YearSelector'
import { filteredProgrammes, filterByLevel } from 'Utilities/common'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import facultyNames from '../../facultyTranslations'
import './ComparisonPage.scss'

const CompareByFaculty = ({ questionsList, usersProgrammes, allAnswers }) => {
  const lang = useSelector((state) => state.language)
  const filters = useSelector((state) => state.filters)
  const { faculty, level } = filters
  const user = useSelector((state) => state.currentUser.data)
  const [chosen, setChosen] = useState('')
  const [showEmpty, setShowEmpty] = useState(true)

  if (!usersProgrammes || !allAnswers) return <></>

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

  const facultyProgrammes = filteredProgrammes(lang, usersProgrammes, [], '', filters)

  const universityProgrammes = filterByLevel(usersProgrammes, level)

  const comparedAnswers = (question, programmes) => {
    if (!programmes || !allAnswers) return []
    const filteredKeys = programmes.map((p) => p.key)
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
    <div className="comparison-tab-pane">
      <Grid stackable doubling padded columns={user.admin ? 3 : 2}>
        <Grid.Row>
          <Grid.Column width={16}>
            <YearSelector size="small" />
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
            <FacultyFilter size="large" label={translations.facultyFilter.compare[lang]} />
            <small>{translations.noAccessToAll[lang]}</small>
            {faculty !== 'allFaculties' &&
              (level === 'doctor' || level === 'master' || level === 'bachelor') && (
                <CompanionFilter />
              )}
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
                  answers={comparedAnswers(question, facultyProgrammes.all)}
                  faculty={comparedFaculty ? comparedFaculty.text : ''}
                  programmes={facultyProgrammes ? facultyProgrammes.all : ''}
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
                    answers={comparedAnswers(question, universityProgrammes)}
                    programmes={usersProgrammes ? universityProgrammes : []}
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
