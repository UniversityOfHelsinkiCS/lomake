import logger from '../util/logger.js'
import { getLockForHttp } from '../websocket.js'

let lockMap = {}

const stripTimeouts = room => {
  if (!room) return {}
  return Object.keys(room).reduce((acc, key) => {
    if (!room[key]) return acc
    return {
      ...acc,
      [key]: {
        uid: room[key].uid,
        firstname: room[key].firstname,
        lastname: room[key].lastname,
      },
    }
  }, {})
}

const serializeLockMap = room => {
  return {
    ...stripTimeouts(lockMap[room]),
  }
}

const getLock = async (req, res) => {
  try {
    const { field } = req.body
    const { room } = req.params

    const data = getLockForHttp(req.user, { field, room })
    if (!data) {
      return res.status(401).json({ error: 'Field locked....' })
    }

    return res.json(data)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'Error' })
  }
}

const setLock = async (req, res) => {
  const { room, field } = req.body
  const currentUser = req.user

  if (lockMap[room] && lockMap[room][field] && lockMap[room][field].uid !== currentUser.uid) {
    return res.status(401).json({ error: 'Field locked....' })
  }

  // force release lock after 5 mins if no save
  const timeoutId = setTimeout(() => {
    lockMap = {
      ...lockMap,
      [room]: { ...lockMap[room], [field]: undefined },
    }

    stripTimeouts(lockMap[room])
  }, 300 * 1000)

  lockMap = {
    ...lockMap,
    [room]: {
      ...lockMap[room],
      [field]: {
        uid: currentUser.uid,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        timeoutId,
      },
    },
  }

  return res.status(204).json(serializeLockMap(room))
}

const fetchLocks = async (req, res) => {
  const { room } = req.params
  return res.json(serializeLockMap(room))
}

const deleteLock = async (req, res) => {
  const { room, field } = req.body
  const currentUser = req.user

  if (lockMap[room] && lockMap[room][field] && lockMap[room][field].uid === currentUser.uid) {
    lockMap = {
      ...lockMap,
      [room]: {
        ...lockMap[room],
        [field]: undefined,
      },
    }
    return res.status(204).json(serializeLockMap(room))
  }

  return res.status(404).json({ error: 'Field not found...' })
}

export default { getLock, setLock, fetchLocks, deleteLock }
