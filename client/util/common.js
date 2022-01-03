/**
 * Insert common items here
 */
import toscalogoColor from 'Assets/toscalogo_color.svg'
import toscalogoGrayscale from 'Assets/toscalogo_grayscale.svg'

export const images = {
  toska_color: toscalogoColor,
  toska_grayscale: toscalogoGrayscale,
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

const getUserGroupSortValue = ({ admin, wideReadAccess }) => {
  if (admin) return 2
  if (wideReadAccess) return 1
  return 0
}

export const sortedItems = (items, sorter, lang) => {
  if (!items) return []
  if (!sorter) return items
  const sorted = items.sort((a, b) => {
    if (sorter == 'name') {
      const aName = a.name[lang] ? a.name[lang] : a.name.en
      const bName = b.name[lang] ? b.name[lang] : b.name.en
      return aName.localeCompare(bName)
    }
    if (sorter == 'userGroup') {
      const aval = getUserGroupSortValue(a)
      const bval = getUserGroupSortValue(b)

      if (aval > bval) return -1
      if (bval < aval) return 1
      return 0
    }
    if (sorter == 'lastLogin') {
      if (new Date(a.lastLogin) < new Date(b.lastLogin)) return -1
      if (new Date(a.lastLogin) > new Date(b.lastLogin)) return 1
    }
    if (sorter == 'access') {
      if (Object.entries(a.access).length > Object.entries(b.access).length) return -1
      if (Object.entries(a.access).length < Object.entries(b.access).length) return 1
    }
    if (typeof a[sorter] === 'string') return a[sorter].localeCompare(b[sorter])
    if (typeof a[sorter] === 'boolean') return a[sorter] - b[sorter]
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
      if (part.type !== 'TITLE') {
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
  if (!string) return
  if (string === '') return
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

export const getMeasuresAnswer = (data, rawId) => {
  const questionId = rawId.substring(0, rawId.length - 5)
  if (!data) return ''
  if (data[`${questionId}_text`]) return data[`${id}_text`]

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

export const answersByYear = (year, tempAnswers, oldAnswers, deadline) => {
  // if viewing past years' answers
  if (year < new Date().getFullYear() && oldAnswers && oldAnswers.data) {
    return oldAnswers.data.filter(a => a.year === year)
  }
  // if the form is not open, and the cronjob has already moved everything to oldAnswers
  if (!deadline && oldAnswers && oldAnswers.data && oldAnswers.years.includes(year)) {
    return oldAnswers.data.filter(a => a.year === year)
  }
  // if there is a deadline (the form is open) and tempAnswers exist
  if (deadline && tempAnswers) {
    return tempAnswers.data
  }
  // if there is no deadline and no tempAnswers, choose oldAnswers instead
  if (!deadline && !tempAnswers && oldAnswers && oldAnswers.data) {
    return oldAnswers.data.filter(a => a.year === year)
  }

  return []
}

// https://stackoverflow.com/a/9083076
export function romanize(num) {
  if (isNaN(num)) return NaN
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

export * from '@root/config/common'
