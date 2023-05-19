/**
 * Insert common items here
 */
import _ from 'lodash'

import toscalogoColor from 'Assets/toscalogo_color.svg'
import toscalogoGrayscale from 'Assets/toscalogo_grayscale.svg'
import hy from 'Assets/hy_logo.svg'

export const images = {
  toska_color: toscalogoColor,
  toska_grayscale: toscalogoGrayscale,
  hy,
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

export const modifiedQuestions = (questions, lang) => {
  // Gives a localized list of questions with
  // text_id, color_id, label, section, title and question nr.
  let attributes = []
  let titleIndex = -1

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
      } else if (part.type !== 'TITLE') {
        attributes = [
          ...attributes,
          {
            id: `${part.id}_text`,
            color: `${part.id}_light`,
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
  const { faculty, level, companion, doctoralSchool } = filters

  const filteredByName = usersProgrammes.filter(p => {
    const prog = p.name[lang]
    return prog.toLowerCase().includes(debouncedFilter.toLowerCase())
  })

  const filteredByLevel = filteredByName.filter(p => {
    if (level === 'allProgrammes') {
      return true
    }
    if (level === 'international') {
      return p.international
    }
    return p.level === level
  })

  const filteredByFaculty = filteredByLevel.filter(p => {
    if (faculty === 'allFaculties') return true
    if (companion) {
      const companionFaculties = p.companionFaculties.map(f => f.code)
      if (companionFaculties.includes(faculty)) return true
      return p.primaryFaculty.code === faculty
    }
    return p.primaryFaculty.code === faculty
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
    .replace(/_x000D_/g, '')
    .replace(/&#8259;/g, '\n')
    .replace(/ *• */g, '\n')
    .replace(/· /g, '\n')
    .replace(/\*\*/g, '')
    .replace(/ {2}•/g, '\n')
    .replace(/ - /g, '\n')

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
      if (data[`${questionId}_${i}_text`]) measures += `${i}) ${cleanText(data[`${questionId}_${i}_text`])} \n`
      i++
    }

    return measures
  }

  return null
}

export const allYears = oldAnswers => {
  let years = oldAnswers && oldAnswers.years ? [...oldAnswers.years] : []
  const currentYear = new Date().getFullYear()
  if (!years.includes(currentYear)) years = [...years, currentYear]
  return years
}

export const answersByYear = ({ year, tempAnswers, oldAnswers, draftYear }) => {
  // if viewing past years' answers
  if (draftYear !== year && oldAnswers && oldAnswers.data) {
    return oldAnswers.data.filter(a => a.year === year)
  }
  // if there is a deadline (the form is open) and tempAnswers exist
  if (draftYear && tempAnswers) {
    return tempAnswers.data
  }
  // if there is no deadline and no tempAnswers, choose oldAnswers instead
  if (!draftYear && !tempAnswers && oldAnswers && oldAnswers.data) {
    return oldAnswers.data.filter(a => a.year === year)
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
      filters = filters.concat([5, 6])
    }
    if (f.id === 'doctoral' && f.value === false) {
      filters = filters.concat(7)
    }
    return 0
  })
  return filters
}

export const getForm = formType => {
  if (formType === 'degree-reform') {
    return 2
  }
  if (formType === 'degree-reform-individual') {
    return 3
  }
  // if (formType === 'evaluation') {
  //   return 4
  // } Needs finetuning for evaluation
  if (formType === 'yearlyAssesment') {
    return 1
  }
  return 1
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
export * from '@root/config/common'
