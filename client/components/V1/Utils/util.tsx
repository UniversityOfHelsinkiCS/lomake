import { isInteger } from 'lodash'

export const calculateColor = (value: number, threshold: string, liikennevalo: boolean) => {
  if (!liikennevalo) {
    return 'Tyhjä'
  } else if (!value || !threshold) {
    return 'Harmaa'
  }

  const [first, second, third] = threshold
    .split(';')
    .map(str => str.replace(',', '.'))
    .map(Number)

  if (first === 0) {
    if (value < second) {
      return 'Punainen'
    } else if (value < third) {
      return 'Keltainen'
    } else if (value >= third) {
      return 'Vihreä'
    } else {
      return 'Harmaa'
    }
  } else {
    if (value >= first) {
      return 'Punainen'
    } else if (value >= second) {
      return 'Keltainen'
    } else if (value < second) {
      return 'Vihreä'
    } else {
      return 'Harmaa'
    }
  }
}

export const calculateValue = (value: number, unit?: string) => {
  if (!value) {
    return 'Ei dataa'
  } else if (unit) {
    return `${(value * 100).toFixed(0)} ${unit}`
  } else {
    if (isInteger(value)) {
      return value.toString()
    }
    return value.toFixed(2)
  }
}
