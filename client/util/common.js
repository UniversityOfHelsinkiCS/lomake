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
  background_red: '#ff7f7f',
  background_yellow: '#ffffb1',
  background_green: '#9dff9d',
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

//https://stackoverflow.com/a/9083076
export function romanize(num) {
  if (isNaN(num)) return NaN
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
