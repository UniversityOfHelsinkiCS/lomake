/**
 * Insert common items here
 */
import toscalogoColor from 'Assets/toscalogo_color.svg'
import toscalogoGrayscale from 'Assets/toscalogo_grayscale.svg'

export const images = {
  toska_color: toscalogoColor,
  toska_grayscale: toscalogoGrayscale
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
  gray: '#A0A0A0',
  dark_gray: '#4e4c4c',
  black: '#1B1C1D',
  dimmer_dark: 'rgba(0, 0, 0, 0.75)',
}

export const sortedItems = (items, sorter, languageCode) => {
  if (!items) return []

  const sorted = items.sort((a, b) => {
    if (sorter == 'name') {
      const aName = a.name[languageCode] ? a.name[languageCode] : a.name['en']
      const bName = b.name[languageCode] ? b.name[languageCode] : b.name['en']
      return aName.localeCompare(bName)
    }
    if (typeof a[sorter] === 'string') return a[sorter].localeCompare(b[sorter])
    if (typeof a[sorter] === 'boolean') return a[sorter] - b[sorter]
  })
  return sorted
}

export const programmeNameByKey = (studyProgrammes, programmeWithKey, languageCode) => {
  let prog = ""
  if (studyProgrammes) prog = studyProgrammes.find((a) => a.key === programmeWithKey.programme)
  else prog = programmeWithKey
  return prog.name[languageCode] ? prog.name[languageCode] : prog.name['en']
}

export const keysWithFaculties = (faculties) => {
  if (!faculties) return []
  let programmesWithFaculties = new Map()
  faculties.forEach((faculty) => {
    faculty.programmes.forEach((programmeKey) => programmesWithFaculties.set(programmeKey, faculty.name))
  })
  return programmesWithFaculties
}

export const facultiesWithKeys = (faculties) => {
  if (!faculties) return
  let facultiesWithProgrammes = new Map()
  faculties.forEach((faculty) => {
    faculty.programmes.forEach((programmeKey) => facultiesWithProgrammes.set(programmeKey, faculty.code))
  })
  return facultiesWithProgrammes
}

export const cleanText = (string) => {
  if (!string) return
  if (string === '') return
  const cleanedText = string
    .replace(/_x000D_/g, '')
    .replace(/&#8259;/g, '\n')
    .replace(/ *• */g, '\n')
    .replace(/· /g, '\n')
    .replace(/\*\*/g, '')
    .replace(/  •/g, '\n')
    .replace(/ - /g, '\n')

  return cleanedText
}

export const getMeasuresAnswer = (data) => {
  const questionId = 'measures'
  if (!data) return ''
  if (!!data[`${questionId}_text`]) return data[`${id}_text`]

  if (!!data[`${questionId}_1_text`]) {
    let measures = ''
    let i = 1
    while (i < 6) {
      if (!!data[`${questionId}_${i}_text`])
        measures += `${i}) ${cleanText(data[`${questionId}_${i}_text`])} \n`
      i++
    }

    return measures
  }

  return null
}

export const answersByYear = (year, answers, oldAnswers) => {
  return year === new Date().getFullYear()
    ? answers.data
    : oldAnswers.data.filter((a) => a.year === year)
}

//https://stackoverflow.com/a/9083076
export function romanize(num) {
  if (isNaN(num)) return NaN
  if (num === 0) return 0
  var digits = String(+num).split(''),
    key = [
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
      'IX'
    ],
    roman = '',
    i = 3
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman
  return Array(+digits.join('') + 1).join('M') + roman
}

export * from '@root/config/common'
