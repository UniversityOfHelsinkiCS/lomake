import isEqual from 'lodash/isEqual.js'
import db from '../models/index.js'
import { AUTOMATIC_IAM_PERMISSIONS_ENABLED } from '../util/common.js'
import getIAMRights from '../util/IAMrights.js'
import logger from '../util/logger.js'

const checkTemporaryAccesses = (access, tempAccess) => {
  if (tempAccess.length === 0) return
  try {
    tempAccess.forEach(a => {
      const end = new Date(a.endDate)
      end.setHours(23, 59, 59)
      if (end >= new Date()) {
        access[a.programme] = { read: true, write: a.writingRights }
      }
    })
  } catch (error) {
    logger.error('Error in adding temp accesses:', error)
  }
}

const IAMmiddleware = async (req, _, next) => {
  if (req.path.includes('socket.io')) return next()
  if (req.path.includes('/cypress/')) return next()

  const { user } = req
  const { headers } = req

  if (req.path.includes('login') && AUTOMATIC_IAM_PERMISSIONS_ENABLED) {
    const { access, specialGroup, iamGroups } = getIAMRights(headers?.hygroupcn)
    logger.info({ message: `${user?.uid}: ${headers?.hygroupcn}` })

    checkTemporaryAccesses(access, user.tempAccess)

    if (
      !isEqual(specialGroup, user.specialGroup) ||
      !isEqual(access, user.access) ||
      !isEqual(iamGroups, user.iamGroups)
    ) {
      user.specialGroup = specialGroup
      user.access = access
      user.iamGroups = iamGroups

      // can not do this to cached user
      const userFromDb = await db.user.findOne({
        where: {
          uid: user.uid,
        },
      })
      logger.info('IAMmiddleware', JSON.stringify(userFromDb, null, 2))
      userFromDb.specialGroup = specialGroup
      userFromDb.access = access
      userFromDb.iamGroups = iamGroups

      await userFromDb.save()
      logger.info(`User access rights set ${user.uid}`)
    }
  }

  return next()
}

export default IAMmiddleware
