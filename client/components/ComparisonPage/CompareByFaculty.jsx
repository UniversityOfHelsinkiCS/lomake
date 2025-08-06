import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Grid, Radio } from 'semantic-ui-react'
import { formKeys } from '../../../config/data'
import { useTranslation } from 'react-i18next'
import CompanionFilter from '../Generic/CompanionFilter'
import LevelFilter from '../Generic/LevelFilter'
import FacultyFilter from '../Generic/FacultyFilter'
import YearSelector from '../Generic/YearSelector'
import { filteredProgrammes, filterByLevel } from '../../util/common'
import { isAdmin } from '../../../config/common'
import PieChart from './PieChart'
import SingleProgramPieChart from './SingleProgramPieChart'
import './ComparisonPage.scss'
import FormFilter from '../Generic/FormFilter'

const CompareByFaculty = ({ questionsList, usersProgrammes, allAnswers }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const filters = useSelector(state => state.filters)
  const faculties = useSelector(state => state.faculties.data)
  const { faculty, level } = filters
  const user = useSelector(state => state.currentUser.data)
  const [chosen, setChosen] = useState('')
  const [showEmpty, setShowEmpty] = useState(true)

  if (!usersProgrammes || !allAnswers) return null

  const handleChosenChange = (e, { value }) => {
    setChosen(value)
  }

  const getChosenProgrammeFaculty = () => {
    const searched = usersProgrammes.find(p => p.name[lang] === chosen)
    if (!searched) return ''

    const facultyName = searched.primaryFaculty.name[lang]
    if (!facultyName) return ''

    return facultyName
  }

  const getComparedFaculty = () => {
    if (!faculties) return ''
    const comparedFaculty = faculties.find(f => f.name[lang] === faculty)
    if (!comparedFaculty) return ''

    return comparedFaculty.name[lang]
  }

  const getChosenAnswers = question => {
    if (!allAnswers || !chosen) return []
    const answers = allAnswers.get(question.id)
    if (answers) return answers.filter(a => a.name === chosen)
    return []
  }

  const getComparedAnswers = (question, programmes) => {
    if (!programmes || !allAnswers) return []
    const filteredKeys = programmes.map(p => p.key)
    const answers = allAnswers.get(question.id)
    if (answers) return answers.filter(a => filteredKeys.includes(a.key))
    return []
  }

  const facultyProgrammes = filteredProgrammes(lang, usersProgrammes, [], '', filters)

  const universityProgrammes = filterByLevel(usersProgrammes, level)

  const options = usersProgrammes.map(p => ({
    key: p.key,
    value: p.name[lang],
    text: p.name[lang],
  }))

  return (
    <div className="tab-pane">
      <Grid stackable doubling padded columns={isAdmin(user) ? 3 : 2}>
        <Grid.Row>
          <Grid.Column>
            <YearSelector size="small" style={{ paddingBottom: '1em' }} />
          </Grid.Column>
          <Grid.Column>
            <FormFilter version="compareByFaculty" />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <div style={{ paddingLeft: '1em' }}>
            <LevelFilter comparison />
          </div>
        </Grid.Row>
        <Grid.Row className="row">
          <Grid.Column>
            <div style={{ paddingTop: '2em' }}>
              <label>{t('comparison:chosenProgrammes')}</label>
              <Dropdown
                fluid
                selection
                search
                placeholder={t('comparison:chooseProgramme')}
                value={chosen}
                onChange={handleChosenChange}
                options={usersProgrammes ? options : []}
                data-cy="programme-filter"
              />
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="filter">
              {filters.form !== formKeys.EVALUATION_FACULTIES && (
                <FacultyFilter size="large" label={t('comparison:compareFaculties')} />
              )}
              <small>{t('comparison:noAccessToAll')}</small>
              {faculty[0] !== 'allFaculties' &&
                (level === 'doctoral' || level === 'master' || level === 'bachelor') && <CompanionFilter />}
            </div>
          </Grid.Column>
          <Grid.Column>
            <Radio
              className={`toggle${isAdmin(user) ? '' : '-marginless'}`}
              checked={showEmpty}
              onChange={() => setShowEmpty(!showEmpty)}
              label={t('comparison:emptyAnswers')}
              toggle
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid className="color-grid" centered stackable doubling relaxed columns={isAdmin(user) ? 3 : 2}>
        <Grid.Column>
          {questionsList.map(
            question =>
              getChosenAnswers(question) &&
              !question.no_color && (
                <SingleProgramPieChart
                  key={question.id}
                  question={question}
                  answers={getChosenAnswers(question)}
                  programmeName={chosen || ''}
                  programmeFaculty={getChosenProgrammeFaculty()}
                  showEmpty={showEmpty}
                  columns={isAdmin(user) ? 3 : 2}
                />
              ),
          )}
        </Grid.Column>
        <Grid.Column>
          {questionsList.map(
            question =>
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
                  columns={isAdmin(user) ? 3 : 2}
                />
              ),
          )}
        </Grid.Column>
        {isAdmin(user) && (
          <Grid.Column>
            {questionsList.map(
              question =>
                allAnswers.get(question.id) &&
                !question.no_color && (
                  <PieChart
                    key={question.id}
                    question={question}
                    showEmpty={showEmpty}
                    answers={getComparedAnswers(question, universityProgrammes)}
                    programmes={usersProgrammes ? universityProgrammes : []}
                    faculty={t('comparison:university')}
                    name="university"
                    columns={isAdmin(user) ? 3 : 2}
                  />
                ),
            )}
          </Grid.Column>
        )}
      </Grid>
    </div>
  )
}

export default CompareByFaculty
