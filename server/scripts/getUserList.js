const fs = require('fs')
const db = require('../models/index')
const logger = require('../util/logger')

const mapProgrammes = programmes => {
  const programmeMap = new Map()
  programmes.forEach(p => programmeMap.set(p.key, p.name.fi))
  return programmeMap
}

const formatRights = programme => {
  return Object.keys(programme)
    .filter(e => programme[e])
    .join('&')
}

const getUserList = async () => {
  try {
    logger.info(`Getting all users and their rights`)

    const users = await db.user.findAll({})
    const programmes = await db.studyprogramme.findAll({})
    const programmeKeyMap = mapProgrammes(programmes)

    let data = ''
    users.forEach(async user => {
      const { firstname, lastname, access } = user

      const programmeKeys = access ? Object.keys(access) : null

      if (programmeKeys) {
        programmeKeys.forEach(key => {
          data = data.concat(
            `${programmeKeyMap.get(key)};${key};${firstname} ${lastname};${formatRights(access[key])}\n`,
          )
        })
      }
    })
    logger.info(`${users.length} users listed`)

    try {
      fs.writeFileSync(`${__dirname}/userlist.csv`, data)
    } catch (error) {
      logger.error(error)
    }
  } catch (error) {
    logger.error(`Failed to get the user list: ${error}`)
  }
}

module.exports = {
  getUserList,
}
