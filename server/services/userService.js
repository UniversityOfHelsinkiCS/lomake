import { LRUCache } from 'lru-cache'
import db from '../models/index.js'
import logger from '../util/logger.js'

const lru = new LRUCache({
  max: 200,
  ttl: 86400000, // 24h,
})

const cache = {
  get: uid => lru.get(uid),
  set: (uid, userJson) => lru.set(uid, userJson),
  invalidate: uid => {
    if (lru.delete(uid)) {
      logger.info(`[CACHE] invalidate user ${uid}`)
    }
  },
  invalidateAll: () => {
    logger.info(`[CACHE] invalidate user ALL`)
    lru.clear()
  },
}

const getUserByUid = async uid => {
  const userFromCache = cache.get(uid)

  if (userFromCache) {
    return userFromCache
  }

  const userFromDb = await db.user.findOne({
    where: {
      uid,
    },
  })
  if (!userFromDb) {
    return null
  }

  const userJson = userFromDb.toJSON()
  cache.set(uid, userJson)

  return userJson
}

export default getUserByUid
