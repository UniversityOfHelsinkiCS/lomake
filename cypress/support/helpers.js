import { data } from "../../config/data"

const getTotalProgrammeCount = () => {
  return data.flatMap(fac => fac.programmes).length
}

const getDoctoralProgrammeCount = () => {
  return data.flatMap(fac => fac.programmes).filter(p => p.key.startsWith('T')).length
}

export default {
  getTotalProgrammeCount,
  getDoctoralProgrammeCount
}