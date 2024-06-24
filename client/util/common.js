/**
 * Insert common items here
 */
import _ from 'lodash'

import toscalogoColor from 'Assets/toscalogo_color.svg'
import toscalogoGrayscale from 'Assets/toscalogo_grayscale.svg'
import hy from 'Assets/hy_logo.svg'
import { formKeys, facultyList } from '../../config/data'

import {
  yearlyQuestions,
  evaluationQuestions,
  facultyEvaluationQuestions as evaluationFacultyQuestions,
  degreeReformIndividualQuestions as degreeQuestionData,
  metareviewQuestions,
} from '../questionData'

export const images = {
  toska_color: toscalogoColor,
  toska_grayscale: toscalogoGrayscale,
  hy,
}

export const degreeReformBackgroundColor = value => {
  const degreeReformAvgColors = {
    0: 'red',
    2: 'orange',
    3: 'yellow',
    4: 'lightgreen',
    4.5: 'green',
  }

  let backgroundColor = '#f8f8f8'
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(degreeReformAvgColors)) {
    if (value > key) {
      backgroundColor = degreeReformAvgColors[key]
    }
  }
  return backgroundColor
}

export const colors = {
  background_blue: '#dff0ff',
  background_red: '#F37778',
  background_yellow: '#F9D03B',
  background_green: '#1DB954',
  background_white: '#FFFFFF',
  background_beige: 'rgba(255, 205, 76, 0.18)',
  background_light_gray: '#f8f8f8',
  background_gray: '#f5f5f5',
  background_black: '#1B1C1D',
  blue: '#0E6EB8',
  red: '#e64e40',
  yellow: '#FFD700',
  green: '#00944b',
  white: '#FFFFFF',
  light_gray: '#e6e6e6',
  gray: '#747474',
  dark_gray: '#4e4c4c',
  black: '#1B1C1D',
  dimmer_dark: 'rgba(0, 0, 0, 0.75)',
  light_green: '#9dff9d',
  light_red: '#ff9d9d',
  light_yellow: '#ffff9d',
}

const getUserGroupSortValue = ({ specialGroup }) => {
  if (!specialGroup) return 'basicUser'
  if (specialGroup.admin) return 'admin'
  if (specialGroup.superAdmin) return 'superAdmin'
  return 'basicUser'
}

export const sortedItems = (items, sorter, lang) => {
  if (!items) return []
  if (!sorter) return items
  const sorted = items.sort((a, b) => {
    if (sorter === 'name') {
      const aName = a.name[lang] ? a.name[lang] : a.name.en
      const bName = b.name[lang] ? b.name[lang] : b.name.en
      if (!aName || !bName) return a
      return aName.localeCompare(bName)
    }
    if (sorter === 'userGroup') {
      const aval = getUserGroupSortValue(a)
      const bval = getUserGroupSortValue(b)

      if (aval > bval) return -1
      if (bval < aval) return 1
      return 0
    }
    if (sorter === 'lastLogin') {
      if (new Date(a.lastLogin) < new Date(b.lastLogin)) return -1
      if (new Date(a.lastLogin) > new Date(b.lastLogin)) return 1
    }
    if (sorter === 'access') {
      if (Object.entries(a.access).length > Object.entries(b.access).length) return -1
      if (Object.entries(a.access).length < Object.entries(b.access).length) return 1
    }
    if (typeof a[sorter] === 'string') {
      if (!a[sorter] || !b[sorter]) return a
      return a[sorter].localeCompare(b[sorter])
    }
    if (typeof a[sorter] === 'boolean') {
      return a[sorter] - b[sorter]
    }
    return undefined
  })
  return sorted
}

export const filterFromUrl = () => {
  const url = window.location.href
  const langStart = url.indexOf('filter=')
  if (langStart === -1) {
    return undefined
  }

  let filterVal = url.substring(langStart + 7)
  const filterEnd = filterVal.indexOf('&')
  if (filterEnd !== -1) {
    filterVal = filterVal.substring(0, filterEnd)
  }

  return filterVal
}

export const modifiedQuestions = (lang, form) => {
  // Gives a localized list of questions with
  // text_id, color_id, label, section, title and question nr.
  let attributes = []
  let titleIndex = -1

  let questions = []

  if (form === formKeys.YEARLY_ASSESSMENT) {
    questions = yearlyQuestions
  } else if (form === formKeys.DEGREE_REFORM_PROGRAMMES) {
    questions = degreeQuestionData
  } else if (form === formKeys.DEGREE_REFORM_INDIVIDUALS) {
    questions = degreeQuestionData
  } else if (form === formKeys.EVALUATION_PROGRAMMES) {
    questions = evaluationQuestions
  } else if (form === formKeys.EVALUATION_FACULTIES) {
    questions = evaluationFacultyQuestions
  } else if (form === 7) {
    questions = metareviewQuestions
  }

  questions.forEach(question => {
    titleIndex += 1
    question.parts.forEach(part => {
      if (part.type === 'SELECTION') {
        attributes = [
          ...attributes,
          {
            id: `${part.id}_selection`,
            color: `${part.id}_light`,
            description: part.description ? part.description[lang] : '',
            label: _.capitalize(part.label[lang]),
            title: question.title[lang],
            titleIndex,
            labelIndex: part.index,
            no_color: part.no_color,
            extrainfo: part.extrainfo ? part.extrainfo[lang] : '',
            options: part.options,
          },
        ]
      } else if (part.type === 'ORDER') {
        attributes = [
          ...attributes,
          {
            id: part.id,
            color: `${part.id}_light`,
            description: part.description ? part.description[lang] : '',
            label: _.capitalize(part.label[lang]),
            title: question.title[lang],
            titleIndex,
            labelIndex: part.index,
            no_color: part.no_color,
            extrainfo: part.extrainfo ? part.extrainfo[lang] : '',
            options: part.options,
          },
        ]
      } else if (part.type === 'ACTIONS') {
        attributes = [
          ...attributes,
          {
            id: part.id,
            color: `${part.id}_light`,
            description: part.description ? part.description[lang] : '',
            label: _.capitalize(part.label[lang]),
            title: question.title[lang],
            titleIndex,
            labelIndex: part.index,
            no_color: part.no_color,
            extrainfo: part.extrainfo ? part.extrainfo[lang] : '',
            options: part.options,
          },
        ]
      } else if (part.type !== 'TITLE') {
        let colorId = `${part.id}_light`
        if (form === formKeys.EVALUATION_FACULTIES) {
          colorId = [`${part.id}_bachelor_light`, `${part.id}_master_light`, `${part.id}_doctoral_light`]
        }
        attributes = [
          ...attributes,
          {
            id: `${part.id}_text`,
            color: colorId,
            description: part.description ? part.description[lang] : '',
            label: _.capitalize(part.label[lang]),
            title: question.title[lang],
            titleIndex,
            labelIndex: part.index,
            no_color: part.no_color,
            extrainfo: part.extrainfo ? part.extrainfo[lang] : '',
          },
        ]
      }
    })
  })

  return attributes
}

const doctoralSchools = {
  social: [
    'T920101',
    'T920102',
    'T920103',
    'T920104',
    'T920105',
    'T920106',
    'T920107',
    'T920108',
    'T920109',
    'T920110',
    'T920111',
  ],
  health: ['T921101', 'T921102', 'T921103', 'T921104', 'T921105', 'T921106', 'T921107', 'T921108'],
  environmental: ['T922101', 'T922102', 'T922103', 'T922104', 'T922105', 'T922106'],
  sciences: ['T923101', 'T923102', 'T923103', 'T923104', 'T923105', 'T923106', 'T923107'],
}

export const filterByLevel = (usersProgrammes, level) => {
  const programmes = usersProgrammes.filter(p => {
    if (level === 'allProgrammes') {
      return true
    }
    if (level === 'international') {
      return p.international
    }
    return p.level === level
  })

  return programmes
}

export const filteredProgrammes = (lang, usersProgrammes, picked, debouncedFilter, filters) => {
  if (!usersProgrammes) return { chosen: [], all: [] }
  const { faculty, level, companion, doctoralSchool, form } = filters

  const filteredByName = usersProgrammes.filter(p => {
    const prog = p.name[lang]
    return prog.toLowerCase().includes(debouncedFilter.toLowerCase())
  })

  const filteredByLevel = filteredByName.filter(p => {
    if (level === 'allProgrammes' || form === formKeys.EVALUATION_FACULTIES) {
      return true
    }
    if (level === 'international') {
      return p.international
    }
    return p.level === level
  })

  const filteredByFaculty = filteredByLevel.filter(p => {
    if (faculty[0] === 'allFaculties' || formKeys.EVALUATION_FACULTIES === filters.form) return true
    if (companion) {
      const companionFaculties = p.companionFaculties.map(f => f.code)
      if (
        companionFaculties.find(cf => {
          return faculty.includes(cf)
        })
      )
        return true
      return faculty.includes(p.primaryFaculty.code)
    }
    return faculty.includes(p.primaryFaculty.code)
  })

  const filteredBySchool = filteredByFaculty.filter(p => {
    if (doctoralSchool === 'allSchools') return true
    return doctoralSchools[doctoralSchool].includes(p.key)
  })

  const filteredByPick = filteredBySchool.filter(p => {
    return picked.includes(p)
  })

  return { chosen: filteredByPick, all: filteredBySchool }
}

export const programmeNameByKey = (studyProgrammes, programmeWithKey, lang) => {
  if (!studyProgrammes) return ''
  const programme = studyProgrammes.find(a => a.key === programmeWithKey.programme)
  if (!programme) return ''
  return programme.name[lang] ? programme.name[lang] : programme.name.en
}

export const cleanText = string => {
  if (!string) return undefined
  if (string === '') return undefined
  const cleanedText = string
    .replace(/,/g, ',')
    .replace(/"/g, "'")
    .replace(/\n\n/g, '\n')
    .replace(/. +\n/g, '.\n')
    .replace(/ {4}- /g, '')
    .replace(/^- /g, '')
    .replace(/\n- /g, '\n')
    .replace(/ +- +/g, '\n')
    .replace(/\r/g, ' ')
    .replace(/;/g, ',')
    .replace(/\*\*/g, '')
    .replace(/&#8259;/g, ' ')
    .replace(/ *• */g, '')
    .replace(/· /g, '')
    .replace(/_x000D_/g, '\n')

  return cleanedText
}

export const getSelectionAnswer = (data, question, lang) => {
  if (!data) return ''
  const { id, options } = question
  const questionId = id.substring(0, id.length - 10)
  let answer = []
  if (data[id]) {
    const selections = JSON.parse(data[id])
    Object.entries(selections).forEach(([key, value]) => {
      if (value) {
        answer = [...answer, options?.[key]?.[lang] || key]
      }
    })
  }
  if (data[`${questionId}_text`]) {
    answer = [...answer, data[`${questionId}_text`]]
  }

  return answer.join(', ')
}

export const getOrderAnswer = (data, question, lang) => {
  if (!data) return ''
  const { id, options } = question
  let answer = ''
  if (data[id]) {
    let i = 1
    const ordered = data[id].split(';;')
    while (i < 4) {
      if (ordered[i - 1]) {
        answer += `${i}. ${options?.[ordered[i - 1]]?.[lang] || ordered[i - 1]} `
      }
      i++
    }
  }
  return answer
}

export const getMeasuresAnswer = (data, rawId) => {
  const questionId = rawId.substring(0, rawId.length - 5)
  if (!data) return ''
  if (data[`${questionId}_text`]) return data[`${rawId}_text`]

  if (data[`${questionId}_1_text`]) {
    let measures = ''
    let i = 1
    while (i < 6) {
      if (data[`${questionId}_${i}_text`]) {
        measures += `${i}) ${cleanText(data[`${questionId}_${i}_text`])} \n`
      }
      i++
    }

    return measures
  }

  return null
}

export const getActionsAnswer = (data, id, t) => {
  if (!data) return ''
  if (data[`${id}-text`]) return data[`${id}_text`]

  if (data[`${id}-1-text`]) {
    let actions = ''
    let i = 1
    while (i < 6) {
      const actionData = data[`${id}-${i}-text`]
      if (actionData) {
        if (actionData.title.length > 0) {
          actions += `${t('report:improvementAreas')} \n`
          actions += `${i}) ${cleanText(actionData.title)} \n`
        }
        if (actionData.actions.length > 0) {
          actions += `${t('report:improvementActions')} \n`
          actions += `${i}) ${cleanText(actionData.actions)} \n`
        }
        if (actionData.actions.length > 0 || actionData.title.length > 0) {
          actions += '\n'
        }
      }
      i++
    }
    return actions
  }

  return null
}

export const allYears = oldAnswers => {
  let years = oldAnswers && oldAnswers.years ? [...oldAnswers.years] : []
  const currentYear = new Date().getFullYear()
  if (!years.includes(currentYear)) years = [...years, currentYear]
  return years
}

// eslint-disable-next-line no-unused-vars
export const answersByYear = ({ year, tempAnswers, oldAnswers, draftYear, deadline, form }) => {
  // Special case for faculty evaluation for the moment when showing to all
  if ((form === formKeys.EVALUATION_FACULTIES || form === formKeys.EVALUATION_PROGRAMMES) && draftYear === 2023) {
    if (tempAnswers && !tempAnswers.data) {
      return tempAnswers.data
    }
    return tempAnswers?.data.filter(a => a.year === year).filter(a => !form || a.form === form)
  }

  // if viewing past years' answers
  if (draftYear !== year && oldAnswers && oldAnswers.data) {
    return oldAnswers.data.filter(a => a.year === year).filter(a => !form || a.form === form)
  }

  // if there is a deadline (the form is open) and tempAnswers exist
  if (draftYear && tempAnswers && deadline) {
    if (!tempAnswers.data) return tempAnswers.data
    return tempAnswers.data.filter(a => a.year === year).filter(a => !form || a.form === form)
  }
  // current year but deadline gone
  if (!deadline && draftYear === year && oldAnswers && oldAnswers.data) {
    if (form) {
      return oldAnswers.data.filter(a => a.year === year).filter(a => a.form === form)
    }
    return oldAnswers.data.filter(a => a.year === year)
  }
  // if there is no deadline and no tempAnswers, choose oldAnswers instead
  if (!draftYear && !tempAnswers && oldAnswers && oldAnswers.data) {
    return oldAnswers.data.filter(a => a.year === year).filter(a => !form || a.form === form)
  }

  return []
}

// https://stackoverflow.com/a/9083076
export function romanize(num) {
  if (Number.isNaN(num)) return NaN
  if (num === 0) return 0
  const digits = String(+num).split('')
  const key = [
    '',
    'C',
    'CC',
    'CCC',
    'CD',
    'D',
    'DC',
    'DCC',
    'DCCC',
    'CM',
    '',
    'X',
    'XX',
    'XXX',
    'XL',
    'L',
    'LX',
    'LXX',
    'LXXX',
    'XC',
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
  ]
  let roman = ''
  let i = 3
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman
  return Array(+digits.join('') + 1).join('M') + roman
}

export const getUserRole = userIams => {
  if (userIams.length === 0) return ''
  let role = ''

  if (userIams.includes('hy-ypa-opa-ospa')) return 'Ospa-ryhmä'
  if (userIams.includes('grp-toska')) return 'Toska-ryhmä'
  if (userIams.includes('hy-ypa-opa-opintoasiainpaallikot')) return 'Opintoasiainpäällikkö'
  if (userIams.includes('hy-ypa-toimi-helsinki')) return 'Toiminnanohjausyksikkö'
  if (userIams.includes('hy-ypa-opa-oymp-jory')) return 'Oppimisympäristöjen palvelut'

  role = userIams.find(iam => /hy-ypa-opa-.+/.test(iam))
  if (role) return `Koulutussuunnittelija - ${role.split('-')[4]}`

  role = userIams.find(iam => /hy-[a-z-]+-kojot/.test(iam))
  if (role) return `Koulutusohjelman johtaja - ${role.split('-')[1]} - ${role.split('-')[2]}`

  role = userIams.find(iam => /hy-[a-z-]+-dekanaatti/.test(iam))
  if (role) return `Dekanaatti - ${role.split('-')[1]}`

  if (userIams.includes('hy-rehtoraatti')) return 'Rehtoraatti'

  role = userIams.find(iam => /grp-katselmus-.+/.test(iam))
  if (role) return `Katselmus - ${role.split('-')[2]}`

  if (userIams.includes('hy-ypa-tutto-toht')) return 'Tohtoriohjelmien suunnittelija'
  if (userIams.includes('hy-tohtorikoulutus-johtoryhma')) return 'Tohtorikoulutuksen johtoryhmä'
  if (userIams.includes('hy-tine')) return 'HY:n tieteellinen neuvosto'

  role = userIams.find(iam => /hy-tutkijakoulut-[a-z]+-jory/.test(iam))
  if (role) return `Tutkijakoulun johtoryhmä - ${role.split('-')[2]}`

  role = userIams.find(iam => /hy-[a-z-]+-jory/.test(iam))
  if (role) return `Johtoryhmän jäsen`

  return role
}

export const getFilters = filter => {
  let filters = []
  filter?.map(f => {
    if (f.id === 'bachelor' && f.value === false) {
      filters = filters.concat(4)
    }
    if (f.id === 'masters' && f.value === false) {
      filters = filters.concat(5)
    }
    if (f.id === 'international' && f.value === false) {
      filters = filters.concat(6)
    }
    if (f.id === 'doctoral' && f.value === false) {
      filters = filters.concat(7)
    }
    if (f.id === 'faculty_collarobate' && f.value === false) {
      filters = filters.concat(9)
    }
    return 0
  })
  return filters
}

export const getForm = formType => {
  if (formType === 'yearly') {
    return 1
  }
  if (formType === 'degree-reform') {
    return 2
  }
  if (formType === 'degree-reform-individual') {
    return 3
  }
  if (formType === 'evaluation') {
    return 4
  }
  if (formType === 'evaluation-faculty') {
    return 5
  }
  if (formType === 'evaluation-university') {
    return 6
  }

  return 1
}

export const getFormType = form => {
  if (form === formKeys.YEARLY_ASSESSMENT) {
    return 'yearly'
  }
  if (form === formKeys.DEGREE_REFORM_PROGRAMMES) {
    return 'degree-reform'
  }
  if (form === formKeys.DEGREE_REFORM_INDIVIDUALS) {
    return 'degree-reform-individual'
  }
  if (form === formKeys.EVALUATION_PROGRAMMES) {
    return 'evaluation'
  }
  if (form === formKeys.EVALUATION_FACULTIES) {
    return 'evaluation-faculty'
  }
  if (form === formKeys.EVALUATION_COMMTTEES) {
    return 'evaluation-university'
  }
  if (form === 7) {
    return 'evaluation-committee'
  }

  return 'yearly'
}

export const isFormLocked = (form, lockedForms) => {
  const formType = getFormType(form)
  const lockedStatus = lockedForms[formType]
  return lockedStatus
}
export const getProgramAnswerLevels = programmeKey => {
  let formDataFilter = []
  if (programmeKey === 'MH30_001') {
    formDataFilter = [7]
  } else if (programmeKey === 'MH30_003') {
    formDataFilter = [7]
  } else if (programmeKey.substring(0, 1) === 'T') {
    formDataFilter = [4, 5, 6]
  } else if (programmeKey.substring(0, 2) === 'MH') {
    formDataFilter = [4, 7]
  } else if (programmeKey.substring(0, 2) === 'KH') {
    formDataFilter = [5, 6, 7]
  }
  return formDataFilter
}

export const translateDegreeReformBackground = ({ primaryRole, lang }) => {
  if (!primaryRole) return []
  const splitRadio = primaryRole.split('_-_')
  const check = splitRadio.map(item => {
    if (item.length > 0) {
      const firstCheck = degreeQuestionData[0].parts[1].radioOptions[lang].find(option => option.id === item)?.label
      if (!firstCheck) {
        return degreeQuestionData[0].parts[1].advancedOptions.teaching_or_other_research[lang].find(
          option => option.id === item,
        )?.label
      }
      return firstCheck
    }
    if (item === '') {
      return null
    }
    return item
  })
  return check
}
export const getFormViewRights = ({
  accessToTempAnswers,
  programme,
  writeAccess,
  viewingOldAnswers,
  draftYear,
  year,
  formDeadline,
  form,
}) => {
  if (!accessToTempAnswers) return true
  if (isFormLocked(form, programme.lockedForms)) return true
  if (!writeAccess) return true
  if (viewingOldAnswers) return true
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== form) return true
  return false
}

export const getYearToShow = ({ nextDeadline, form, draftYear }) => {
  const formDeadline = nextDeadline ? nextDeadline.find(dl => dl.form === form) : null

  let year = 2023
  if (formDeadline) {
    year = draftYear.year
  }
  return year
}

export const reversedPointsInDegreeReform = [
  'lead_has_sufficient_authority_to_study_program',
  'master_programs_are_sufficiently_sized',
  'bachelor_programme_starting_amount_is_suitable',
  'question-9-4',
]

export const answersByQuestions = ({
  form,
  usersProgrammes,
  selectedAnswers,
  chosenProgrammes,
  questionsList,
  lang,
  t,
}) => {
  if (!selectedAnswers) {
    return {}
  }
  const answerMap = new Map()

  const chosenKeys = chosenProgrammes.map(p => p.key || (form === formKeys.EVALUATION_FACULTIES && p.code))

  if (!selectedAnswers) return new Map()
  selectedAnswers.forEach(programme => {
    const key = programme.programme
    if (chosenKeys.includes(key)) {
      const { data } = programme
      questionsList.forEach(question => {
        let color = null
        if (form === formKeys.EVALUATION_FACULTIES) {
          const bachelorColor = data[question.color[0]] ? data[question.color[0]] : 'emptyAnswer'
          const masterColor = data[question.color[1]] ? data[question.color[1]] : 'emptyAnswer'
          const doctoralColor = data[question.color[2]] ? data[question.color[2]] : 'emptyAnswer'
          color = { bachelor: bachelorColor, master: masterColor, doctoral: doctoralColor }
        } else {
          color = data[question.color] ? data[question.color] : 'emptyAnswer'
        }
        let answersByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
        let name = programmeNameByKey(usersProgrammes, programme, lang)

        if (form === formKeys.EVALUATION_FACULTIES) {
          name = facultyList.find(f => f.code === programme.programme).name[lang]
        }
        let answer = ''
        if (question.id.startsWith('measures')) answer = getMeasuresAnswer(data, question.id)
        else if (question.id.endsWith('selection')) answer = getSelectionAnswer(data, question, lang)
        else if (question.id.endsWith('_order')) answer = getOrderAnswer(data, question, lang)
        else if (question.id.includes('actions')) answer = getActionsAnswer(data, question.id, t)
        else if (!question.id.startsWith('meta')) answer = cleanText(data[question.id])

        answersByProgramme = [...answersByProgramme, { name, key, color, answer }]
        answerMap.set(question.id, answersByProgramme)
      })
    }
  })
  // if the programme has not yet been answered at all, it won't appear in the selectedAnswers.
  // So empty answers need to be added.
  answerMap.forEach((value, key) => {
    const answeredProgrammes = value.map(p => (form === formKeys.EVALUATION_FACULTIES ? p.code : p.key))
    const programmesMissing = chosenProgrammes.filter(p => !answeredProgrammes.includes(p.key))
    if (programmesMissing) {
      programmesMissing.forEach(p => {
        const earlierAnswers = answerMap.get(key)
        const programmeCode = form === formKeys.EVALUATION_FACULTIES ? p.code : p.key
        answerMap.set(key, [...earlierAnswers, { name: p.name[lang], key: programmeCode, color: 'emptyAnswer' }])
      })
    }
  })

  return answerMap
}

export * from '@root/config/common'
