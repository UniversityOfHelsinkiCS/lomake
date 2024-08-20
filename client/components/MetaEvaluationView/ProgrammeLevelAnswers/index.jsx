import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Loader, Dropdown, Input, Menu, MenuItem } from 'semantic-ui-react'
import { getAllTempAnswersAction } from '../../../util/redux/tempAnswersReducer'
import {
  modifiedQuestions,
  answersByQuestions,
  filterFromUrl,
  filterUserProgrammes,
  kludge,
  getLabel,
} from '../../../util/common'
import { setQuestions } from '../../../util/redux/filterReducer'
import WrittenAnswers from '../../ReportPage/WrittenAnswers'
import { formKeys } from '../../../../config/data'
import useDebounce from '../../../util/useDebounce'
import { setDoctoral } from '../../../util/redux/doctoralReducer'
import { basePath } from '../../../../config/common'
import FacultyDropdown from '../ProgrammeLevelOverview/FacultyDropdown'
import DegreeDropdown from '../ProgrammeLevelOverview/DegreeDropdown'

const doctoralBasedFilter = (doctoral, items, attribute) => {
  return doctoral
    ? items.filter(item => item[attribute].includes('T'))
    : items.filter(item => !item[attribute].includes('T'))
}

const ProgrammeLevelAnswers = () => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const answers = useSelector(state => state.tempAnswers)
  const year = useSelector(state => state.year)
  const form = formKeys.META_EVALUATION
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const { isDoctoral, level: selectedLevel } = useSelector(({ filters }) => ({
    isDoctoral: filters.isDoctoral,
    level: filters.level,
  }))
  const [showing, setShowing] = useState(-1)
  const questionsList = modifiedQuestions(lang, form)
  const faculties = useSelector(state => state.faculties)
  const [answerFilter, setAnswerFilter] = useState('both')
  const filteredQuestions = doctoralBasedFilter(isDoctoral, questionsList, 'id')
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const baseUrl = `${basePath}meta-evaluation/answers`
  const questionLabels = filteredQuestions.map(q => getLabel(q))

  const filterState = useMemo(() => {
    return a => {
      if (selectedLevel === 'bachelor') return a.level === 'bachelor'
      if (selectedLevel === 'master') return a.level === 'master'
      if (selectedLevel === 'doctoral') return a.level === 'doctoral'
      return a.level !== 'doctoral'
    }
  }, [selectedLevel])

  useEffect(() => {
    document.title = `${t('metaEvaluationAnswers')}`
    const filterQuery = filterFromUrl()
    if (filterQuery) setFilter(filterQuery)
    dispatch(setQuestions({ selected: questionLabels, open: [] }))
    dispatch(getAllTempAnswersAction())
  }, [lang, t, dispatch, isDoctoral])

  if (!answers.data || !usersProgrammes || usersProgrammes.length === 0) return <Loader active />

  const filteredProgrammes = filterUserProgrammes(usersProgrammes.filter(filterState), lang, debouncedFilter)

  const answersList =
    answers.data &&
    answersByQuestions({
      chosenProgrammes: filteredProgrammes,
      selectedAnswers: answers.data,
      questionsList,
      usersProgrammes,
      lang,
      t,
      form,
    })

  const filterOptions = [
    { key: 'both', text: t('showBoth'), value: 'both' },
    { key: 'answers', text: t('showOnlyAnswers'), value: 'answers' },
    { key: 'comments', text: t('showOnlyComments'), value: 'comments' },
  ]

  const filterAnswers = answers => {
    return answers.map(answer => ({
      ...answer,
      answer: answerFilter === 'comments' ? undefined : answer.answer,
      comment: answerFilter === 'answers' ? undefined : answer.comment,
    }))
  }

  const handleDropdownFilterChange = value => {
    window.history.pushState({}, '', `${baseUrl}?filter=${value}`)
    setFilter(value)
  }

  const handleFilterChange = e => {
    window.history.pushState({}, '', `${baseUrl}?filter=${e.target.value}`)
    setFilter(e.target.value)
  }

  const filteredAnswersList = new Map(Array.from(answersList).map(([key, value]) => [key, filterAnswers(value)]))

  return (
    <div style={{ width: '80%' }}>
      <Menu size="large" secondary>
        <MenuItem>
          <Button as={Link} to={filter ? `/meta-evaluation?filter=${filter}` : '/meta-evaluation'} icon="arrow left" />
        </MenuItem>
        <MenuItem header>{t('metaEvaluationAnswers').toUpperCase()}</MenuItem>
        <DegreeDropdown />
        <MenuItem>
          <FacultyDropdown
            t={t}
            programmes={usersProgrammes}
            handleFilterChange={handleDropdownFilterChange}
            faculties={faculties}
            lang={lang}
            debouncedFilter={debouncedFilter}
          />
        </MenuItem>
        <MenuItem>
          <Dropdown
            data-cy="content-type-dropdown"
            selection
            options={filterOptions}
            value={answerFilter}
            onChange={(_, { value }) => setAnswerFilter(value)}
          />
        </MenuItem>
        <MenuItem position="right">
          <Input
            data-cy="overviewpage-filter"
            icon="search"
            size="small"
            placeholder={t('programmeFilter')}
            onChange={handleFilterChange}
            value={filter}
          />
        </MenuItem>
      </Menu>
      <WrittenAnswers
        year={year}
        questionsList={filteredQuestions}
        chosenProgrammes={filteredProgrammes}
        usersProgrammes={filteredProgrammes}
        allAnswers={filteredAnswersList}
        showing={showing}
        setShowing={setShowing}
        form={form}
        metaEvaluation
      />
    </div>
  )
}

export default ProgrammeLevelAnswers
