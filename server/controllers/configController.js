/* eslint-disable import/prefer-default-export */
import { data } from '../../config/data.js'

const getData = (_req, res) => {
  res.send(data)
}

// const getCommon = () => { }

// const getIAM = () => { }

// const getMockHeaders = () => { }

export default { getData }
