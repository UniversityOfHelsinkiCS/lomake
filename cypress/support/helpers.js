import { data } from '../../config/data'

const getTotalProgrammeCount = () => {
  return data.flatMap(fac => fac.programmes).length - 1
}

const getDoctoralProgrammeCount = () => {
  return data.flatMap(fac => fac.programmes).filter(p => p.key.startsWith('T')).length - 1
}

export default {
  getTotalProgrammeCount,
  getDoctoralProgrammeCount,
}
