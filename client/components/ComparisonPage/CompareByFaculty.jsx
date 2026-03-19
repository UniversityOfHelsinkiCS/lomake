import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Grid, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '../../../config/data'
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
      <Grid columns={isAdmin(user) ? 3 : 2} doubling padded stackable>
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
                data-cy="programme-filter"
                fluid
                onChange={handleChosenChange}
                options={usersProgrammes ? options : []}
                placeholder={t('comparison:chooseProgramme')}
                search
                selection
                value={chosen}
              />
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="filter">
              {filters.form !== formKeys.EVALUATION_FACULTIES && (
                <FacultyFilter label={t('comparison:compareFaculties')} size="large" />
              )}
              <small>{t('comparison:noAccessToAll')}</small>
              {faculty[0] !== 'allFaculties' &&
                (level === 'doctoral' || level === 'master' || level === 'bachelor') && <CompanionFilter />}
            </div>
          </Grid.Column>
          <Grid.Column>
            <Radio
              checked={showEmpty}
              className={`toggle${isAdmin(user) ? '' : '-marginless'}`}
              label={t('comparison:emptyAnswers')}
              onChange={() => setShowEmpty(!showEmpty)}
              toggle
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid centered className="color-grid" columns={isAdmin(user) ? 3 : 2} doubling relaxed stackable>
        <Grid.Column>
          {questionsList.map(
            question =>
              getChosenAnswers(question) &&
              !question.no_color && (
                <SingleProgramPieChart
                  answers={getChosenAnswers(question)}
                  columns={isAdmin(user) ? 3 : 2}
                  key={question.id}
                  programmeFaculty={getChosenProgrammeFaculty()}
                  programmeName={chosen || ''}
                  question={question}
                  showEmpty={showEmpty}
                />
              )
          )}
        </Grid.Column>
        <Grid.Column>
          {questionsList.map(
            question =>
              getComparedAnswers(question) &&
              !question.no_color && (
                <PieChart
                  answers={getComparedAnswers(question, facultyProgrammes.all)}
                  columns={isAdmin(user) ? 3 : 2}
                  faculty={getComparedFaculty()}
                  key={question.id}
                  name="faculty"
                  programmes={facultyProgrammes ? facultyProgrammes.all : ''}
                  question={question}
                  showEmpty={showEmpty}
                />
              )
          )}
        </Grid.Column>
        {isAdmin(user) && (
          <Grid.Column>
            {questionsList.map(
              question =>
                allAnswers.get(question.id) &&
                !question.no_color && (
                  <PieChart
                    answers={getComparedAnswers(question, universityProgrammes)}
                    columns={isAdmin(user) ? 3 : 2}
                    faculty={t('comparison:university')}
                    key={question.id}
                    name="university"
                    programmes={usersProgrammes ? universityProgrammes : []}
                    question={question}
                    showEmpty={showEmpty}
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
