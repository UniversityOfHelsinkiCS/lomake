import { Op } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import db from '../models/index.js'
import logger from './logger.js'
import { isAdmin, isSuperAdmin, isDevSuperAdminUid, inProduction, whereDraftYear } from './common.js'
import getUserByUid from '../services/userService.js'

let currentEditors = {}
const SEC = 1000

const withLogging = fn => {
  return async (...args) => {
    const uuid = uuidv4()
    const start = Date.now()
    const acualArgs = [...args, uuid]
    const res = await fn(...acualArgs)
    const end = Date.now()

    // Hacky logging. Please improve.
    let payloadString = ''

    const userId = args[0]?.request?.headers?.uid
    payloadString += userId || ''

    if (typeof args[1] === 'object') {
      const { room, data, form } = args[1]
      // Log payload
      payloadString += room && data && form ? ` ${room} form=${form} ${JSON.stringify(data)}` : ''
    }

    logger.info(`[WS] ${fn.name} ${payloadString} ${end - start}ms , UUID=${uuid}`)
    return res
  }
}

const logAndEmit = (socket, event, payload) => {
  socket.emit(event, payload)
}

const logAndEmitToRoom = (socket, room, event, payload) => {
  socket.to(room).emit(event, payload)
}

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

const emitCurrentEditorsTo = (io, room, currentEditors, uid) => {
  const roomCurrentEditors = stripTimeouts(currentEditors[room])
  logger.info(`[WS] update_editors room=${room} ${JSON.stringify(roomCurrentEditors)}`)
  io.in(room).emit('update_editors', { data: roomCurrentEditors, uid })
}

const clearCurrentUser = user => {
  return Object.keys(currentEditors).reduce((editorAcc, room) => {
    if (!currentEditors[room]) return editorAcc
    const currentRoom = currentEditors[room]
    const newRoom = Object.keys(currentRoom).reduce((acc, key) => {
      if (!currentRoom[key]) return acc
      if (currentRoom[key].uid === user.uid) {
        clearTimeout(currentRoom[key].timeoutId)
        return acc
      }
      return { ...acc, [key]: currentRoom[key] }
    }, {})
    return { ...editorAcc, [room]: newRoom }
  }, {})
}

const getCurrentUser = async socket => {
  const { uid } = socket.request.headers

  if (!uid) return null

  const loggedInAs = socket.request.headers['x-admin-logged-in-as']

  if (!inProduction && loggedInAs && isDevSuperAdminUid(uid)) {
    const user = await getUserByUid(loggedInAs)
    return user
  }

  const user = await getUserByUid(uid)
  return user
}

const joinRoom = async (socket, room, form, io) => {
  try {
    const match = [/^\w{4}_\w{3}$/, /^T\d{6}$/, /^\w{3}$/].some(pattern => pattern.test(room))
    const num = /^([1-9]|10)$/.test(form)
    if (!match || !num) throw new Error(`Invalid room format or form: ${room}, ${form}`)

    const currentUser = await getCurrentUser(socket)
    if (
      isAdmin(currentUser) ||
      isSuperAdmin(currentUser) ||
      (currentUser?.access[room] && currentUser?.access[room].read)
    ) {
      const [answer] = await db.tempAnswer.findOrCreate({
        where: {
          [Op.and]: [{ programme: room }, { year: await whereDraftYear() }, { form }],
        },
        defaults: {
          data: {}, // TO FIX - this way creates null for prog + year, 1 for form (db default)
        },
      })
      currentEditors = clearCurrentUser(currentUser)
      socket.join(room)
      emitCurrentEditorsTo(io, room, currentEditors)
      logAndEmit(socket, 'new_form_data', answer.data || {})
    }
  } catch (error) {
    logger.error(`Database error in join room: ${error}`)
  }
}

const leaveRoom = async (socket, room) => {
  socket.leave(room)
  socket.emit('left_success', 'ok')
}

const isTrafficOrRadio = data => {
  const value = Object.values(data).length > 0 && Object.values(data)[0]
  const radioValues = ['green', 'yellow', 'red', 'first', 'second', 'third', 'fourth', 'fifth', 'idk']
  return radioValues.includes(value)
}

const updateField = async (socket, payload, io, uuid) => {
  try {
    const { room, data, form } = payload
    // If form is 10, do nothing, this is called for form 10 but we don't want to save it
    if (!form || form === 10) return

    const currentUser = await getCurrentUser(socket)

    if (
      isAdmin(currentUser) ||
      isSuperAdmin(currentUser) ||
      (currentUser.access[room] && currentUser.access[room].write) ||
      room === currentUser.uid
    ) {
      const field = Object.keys(data)[0]
      const currentEditor = currentEditors[room] ? currentEditors[room][field] : undefined

      if (!isTrafficOrRadio(data) && currentEditor && currentEditor.uid !== currentUser.uid) {
        logger.error(`Missed an edit uid=${currentUser.uid} eid=${currentEditor.uid} uuid=${uuid}`)
        return
      }

      if (currentEditor) {
        clearTimeout(currentEditor.timeoutId)
      }

      if (!isTrafficOrRadio(data)) {
        currentEditors = {
          ...currentEditors,
          [room]: {
            ...currentEditors[room],
            [field]: undefined,
          },
        }

        emitCurrentEditorsTo(io, room, currentEditors)
      }

      const currentAnswer = await db.tempAnswer.findOne({
        where: {
          [Op.and]: [{ programme: room }, { year: await whereDraftYear() }, { form }],
        },
      })
      if (currentAnswer) {
        await db.tempAnswer.update(
          { data: { ...currentAnswer.data, ...data } },
          {
            returning: true,
            where: {
              [Op.and]: [{ programme: room }, { year: await whereDraftYear() }, { form }],
            },
          },
        )
        logAndEmitToRoom(socket, room, 'new_form_data', data)
      } else {
        // This can happen, at least in dev, when the programme is new and was added after deadlines are updated. Updating deadlines may fix.
        logger.error(`PANIC this should never happen: ${uuid}`)
      }
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const getLockHttp = (currentUser, payload, io) => {
  const { field, room } = payload

  if (currentEditors[room] && currentEditors[room][field] && currentEditors[room][field].uid !== currentUser.uid) {
    return undefined
  }

  // force release lock after 5 mins if no save
  const timeoutId = setTimeout(() => {
    currentEditors = {
      ...currentEditors,
      [room]: { ...currentEditors[room], [field]: undefined },
    }

    emitCurrentEditorsTo(io, room, currentEditors)
  }, 300 * SEC)

  currentEditors = {
    ...currentEditors,
    [room]: {
      ...currentEditors[room],
      [field]: {
        uid: currentUser.uid,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        timeoutId,
      },
    },
  }

  emitCurrentEditorsTo(io, room, currentEditors, currentUser.uid)

  // eslint-disable-next-line consistent-return
  return stripTimeouts(currentEditors[room])
}

export default {
  joinRoom: withLogging(joinRoom),
  leaveRoom: withLogging(leaveRoom),
  updateField: withLogging(updateField),
  getLockHttp,
}
