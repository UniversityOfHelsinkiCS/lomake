import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Loader, Dropdown, Input, Menu, MenuItem } from 'semantic-ui-react'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import { modifiedQuestions, answersByQuestions, filterFromUrl } from 'Utilities/common'
import { setQuestions } from 'Utilities/redux/filterReducer'
import WrittenAnswers from 'Components/ReportPage/WrittenAnswers'
import { formKeys } from '@root/config/data'
import useDebounce from 'Utilities/useDebounce'
import { setDoctoral } from 'Utilities/redux/doctoralReducer'
import FacultyDropdown from '../ProgrammeLevelOverview/FacultyDropdown'

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
  const doctoral = useSelector(state => state.doctoral)
  const [showing, setShowing] = useState(-1)
  const questionsList = modifiedQuestions(lang, form)
  const faculties = useSelector(state => state.faculties)
  const [answerFilter, setAnswerFilter] = useState('both')
  const filteredQuestions = doctoralBasedFilter(doctoral, questionsList, 'id')
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  let filteredProgrammes = []
  const doctoralToggleText = t('doctoralToggle')
  const bachelorToggleText = t('bachelorMasterToggle')
  const baseUrl = '/meta-evaluation/answers'

  const getLabel = question => {
    if (!question) return ''
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${question.label}`
  }

  const questionLabels = filteredQuestions.map(q => getLabel(q))

  useEffect(() => {
    document.title = `${t('metaEvaluationAnswers')}`
    const filterQuery = filterFromUrl()
    if (filterQuery) setFilter(filterQuery)
    dispatch(setQuestions({ selected: questionLabels, open: [] }))
    dispatch(getAllTempAnswersAction())
  }, [lang, t, dispatch, doctoral])

  if (!answers.data || !usersProgrammes || usersProgrammes.length === 0) return <Loader active />

  filteredProgrammes = doctoralBasedFilter(doctoral, usersProgrammes, 'key').filter(
    prog =>
      prog.name[lang].toLowerCase().includes(debouncedFilter.toLowerCase()) ||
      prog.primaryFaculty?.code?.toLowerCase().includes(debouncedFilter.toLowerCase()),
  )

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
    window.history.pushState({}, '', `${baseUrl}${doctoral ? '/doctoral' : ''}?filter=${value}`)
    setFilter(value)
  }

  const handleFilterChange = e => {
    window.history.pushState({}, '', `${baseUrl}${doctoral ? '/doctoral' : ''}?filter=${e.target.value}`)
    setFilter(e.target.value)
  }

  const filteredAnswersList = new Map(Array.from(answersList).map(([key, value]) => [key, filterAnswers(value)]))

  const handleDoctoralChange = () => {
    dispatch(setDoctoral(!doctoral))
  }

  return (
    <div style={{ width: '80%' }}>
      <Menu size="large" secondary>
        <MenuItem>
          <Button as={Link} to={filter ? `/meta-evaluation?filter=${filter}` : '/meta-evaluation'} icon="arrow left" />
        </MenuItem>
        <MenuItem header>{t('metaEvaluationAnswers').toUpperCase()}</MenuItem>
        <MenuItem>
          <Dropdown
            data-cy="doctle"
            className="button basic gray"
            direction="left"
            text={doctoral ? doctoralToggleText : bachelorToggleText}
          >
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  if (doctoral) handleDoctoralChange()
                }}
              >
                <p data-cy="bachelorToggleText">{bachelorToggleText}</p>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  if (!doctoral) handleDoctoralChange()
                }}
              >
                <p data-cy="doctoralToggleText">{doctoralToggleText}</p>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </MenuItem>{' '}
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
