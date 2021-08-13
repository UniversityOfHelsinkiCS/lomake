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
import './ComparisonPage.scss'

const CompareByFaculty = ({ questionsList, usersProgrammes, allAnswers }) => {
  const lang = useSelector((state) => state.language)
  const filters = useSelector((state) => state.filters)
  const faculties = useSelector((state) => state.faculties.data)
  const { faculty, level } = filters
  const user = useSelector((state) => state.currentUser.data)
  const [chosen, setChosen] = useState('')
  const [showEmpty, setShowEmpty] = useState(true)

  if (!usersProgrammes || !allAnswers) return <></>

  const handleChosenChange = (e, { value }) => {
    setChosen(value)
  }

  const getChosenProgrammeFaculty = () => {
    const searched = usersProgrammes.find((p) => p.name[lang] === chosen)
    if (!searched) return ''

    const facultyName = searched.primaryFaculty.name[lang]
    if (!facultyName) return ''

    return facultyName
  }

  const getComparedFaculty = () => {
    if (!faculties) return ''
    const comparedFaculty = faculties.find((f) => f.name[lang] === faculty)
    if (!comparedFaculty) return ''

    return comparedFaculty.name[lang]
  } 

  const getChosenAnswers = (question) => {
    if (!allAnswers || !chosen) return []
    const answers = allAnswers.get(question.id)
    if (answers) return answers.filter((a) => a.name == chosen)
    return []
  }

  const getComparedAnswers = (question, programmes) => {
    if (!programmes || !allAnswers) return []
    const filteredKeys = programmes.map((p) => p.key)
    const answers = allAnswers.get(question.id)
    if (answers) return answers.filter((a) => filteredKeys.includes(a.key))
    return []
  }

  const facultyProgrammes = filteredProgrammes(lang, usersProgrammes, [], '', filters)

  const universityProgrammes = filterByLevel(usersProgrammes, level)

  const options = usersProgrammes.map((p) => ({
    key: p.key,
    value: p.name[lang],
    text: p.name[lang],
  }))

  return (
    <div className="comparison-tab-pane">
      <Grid stackable doubling padded columns={user.hasWideReadAccess ? 3 : 2}>
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
              (level === 'doctoral' || level === 'master' || level === 'bachelor') && (
                <CompanionFilter />
              )}
          </Grid.Column>
          <Grid.Column>
            <Radio
              className={`comparison-toggle${user.hasWideReadAccess ? '' : '-marginless'}`}
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
        columns={user.hasWideReadAccess ? 3 : 2}
      >
        <Grid.Column>
          {questionsList.map(
            (question) =>
              getChosenAnswers(question) &&
              !question.no_color && (
                <SingleProgramPieChart
                  key={question.id}
                  question={question}
                  answers={getChosenAnswers(question)}
                  programmeName={chosen ? chosen : ''}
                  programmeFaculty={getChosenProgrammeFaculty()}
                  showEmpty={showEmpty}
                  columns={user.hasWideReadAccess ? 3 : 2}
                />
              )
          )}
        </Grid.Column>
        <Grid.Column>
          {questionsList.map(
            (question) =>
              getComparedAnswers(question) &&
              !question.no_color && (
                <PieChart
                  key={question.id}
                  question={question}
                  showEmpty={showEmpty}
                  answers={getComparedAnswers(question, facultyProgrammes.all)}
                  faculty={getComparedFaculty()}
                  programmes={facultyProgrammes ? facultyProgrammes.all : ''}
                  name="faculty"
                  columns={user.hasWideReadAccess ? 3 : 2}
                />
              )
          )}
        </Grid.Column>
        {user.hasWideReadAccess && (
          <Grid.Column>
            {questionsList.map(
              (question) =>
                allAnswers.get(question.id) &&
                !question.no_color && (
                  <PieChart
                    key={question.id}
                    question={question}
                    showEmpty={showEmpty}
                    answers={getComparedAnswers(question, universityProgrammes)}
                    programmes={usersProgrammes ? universityProgrammes : []}
                    faculty={translations.university[lang]}
                    name="university"
                    columns={user.hasWideReadAccess ? 3 : 2}
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
