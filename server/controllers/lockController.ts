import type { Request, Response } from 'express'
import getUserByUid from '../services/userService.js'
import logger from '../util/logger.js'
import { getLockForHttp } from '../websocket.js'
import { inProduction, isDevSuperAdminUid } from '../../config/common.js'

type User = any

type Error = any

type Lock = {
  uid: string
  firstname: string
  lastname: string
  timeoutId: ReturnType<typeof setTimeout>
}

type LockMap = {
  [room: string]: {
    [field: string]: Lock | undefined
  } | undefined
}

let LOCKMAP: LockMap = {}

const stripTimeouts = (room: Record<string, Lock | undefined>) => {
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

const serializeLockMap = (room: string) => {
  return {
    ...stripTimeouts(LOCKMAP[room]),
  }
}

const parseCookies = (cookieString: string | undefined) => {
  return cookieString
    .split(';')
    .map((cookie: string) => cookie.trim().split('='))
    .reduce((acc, [key, value]) => {
      acc[key] = value === undefined || value === '' || value === 'null' ? undefined : value
      return acc
    }, {} as Record<string, string | undefined>)
}

const getCurrentUser = async (req: Request & { user: User }) => {
  const user = req.user
  const parsedCookies = parseCookies(req.headers.cookie)

  const loggedInAs = parsedCookies['x-admin-logged-in-as']

  if (!inProduction && loggedInAs && isDevSuperAdminUid(user.uid)) {
    const user = await getUserByUid(loggedInAs)
    return user
  }

  return user
}

const getLock = async (req: Request & { user: User }, res: Response) => {
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

const setLock = async (req: Request & { user: User }, res: Response) => {
  try {
    const { room, field } = req.body
    const currentUser = await getCurrentUser(req)

    if (LOCKMAP[room] && LOCKMAP[room][field] && LOCKMAP[room][field].uid !== currentUser.uid) {
      return res.status(401).json({ error: 'Field locked....' })
    }

    // force release lock after 5 mins if no save:
    const timeoutId = setTimeout(() => {
      LOCKMAP = {
        ...LOCKMAP,
        [room]: { ...LOCKMAP[room], [field]: undefined },
      }
      stripTimeouts(LOCKMAP[room])
    }, 300 * 1000)

    LOCKMAP = {
      ...LOCKMAP,
      [room]: {
        ...LOCKMAP[room],
        [field]: {
          uid: currentUser.uid,
          firstname: currentUser.firstname,
          lastname: currentUser.lastname,
          timeoutId,
        },
      },
    }

    return res.status(204).json(serializeLockMap(room))
  } catch (error: Error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
}

const fetchLocks = async (req: Request & { user: User }, res: Response) => {
  try {
    const { room } = req.params
    return res.json(serializeLockMap(room))
  } catch (error: Error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
}

const deleteLock = async (req: Request & { user: User }, res: Response) => {
  try {
    const { room, field } = req.body
    const currentUser = await getCurrentUser(req)

    if (LOCKMAP[room] && LOCKMAP[room][field] && LOCKMAP[room][field].uid === currentUser.uid) {
      LOCKMAP = {
        ...LOCKMAP,
        [room]: {
          ...LOCKMAP[room],
          [field]: undefined,
        },
      }
      return res.status(204).json(serializeLockMap(room))
    }

    return res.status(404).json({ error: 'Field not found...' })
  } catch (error: Error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
}

export default { getLock, setLock, fetchLocks, deleteLock }
