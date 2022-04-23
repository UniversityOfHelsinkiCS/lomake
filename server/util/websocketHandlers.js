const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')
const { isSuperAdminUid } = require('@root/config/common')
const { whereDraftYear } = require('@util/common')

let currentEditors = {}

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

  if (isSuperAdminUid(uid) && loggedInAs) {
    const user = await await db.user.findOne({ where: { uid: loggedInAs } })
    return user
  }

  const user = await db.user.findOne({ where: { uid } })
  return user
}

const joinRoom = async (socket, room, io) => {
  try {
    const currentUser = await getCurrentUser(socket)
    if (currentUser.admin || (currentUser.access[room] && currentUser.access[room].read)) {
      const [answer] = await db.tempAnswer.findOrCreate({
        where: {
          [Op.and]: [{ programme: room }, { year: await whereDraftYear() }],
        },
        defaults: {
          data: {},
        },
      })
      currentEditors = clearCurrentUser(currentUser)
      socket.join(room)
      io.in(room).emit('update_editors', stripTimeouts(currentEditors[room]))
      socket.emit('new_form_data', answer.data || {})
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const leaveRoom = async (socket, room) => {
  socket.leave(room)
  socket.emit('left_success', 'ok')
}

const updateField = async (socket, payload, io) => {
  try {
    const { room, data } = payload

    const currentUser = await getCurrentUser(socket)

    if (currentUser.admin || (currentUser.access[room] && currentUser.access[room].write)) {
      const field = Object.keys(data)[0]
      const currentEditor = currentEditors[room] ? currentEditors[room][field] : undefined

      if (currentEditor && currentEditor.uid !== currentUser.uid) return
      if (currentEditor) {
        clearTimeout(currentEditor.timeoutId)
      }

      const timeoutId = setTimeout(() => {
        currentEditors = {
          ...currentEditors,
          [room]: { ...currentEditors[room], [field]: undefined },
        }
        io.in(room).emit('update_editors', stripTimeouts(currentEditors[room]))
      }, 15000)

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

      io.in(room).emit('update_editors', stripTimeouts(currentEditors[room]))

      const currentAnswer = await db.tempAnswer.findOne({
        where: {
          [Op.and]: [{ programme: room }, { year: await whereDraftYear() }],
        },
      })

      const [rows, [updatedAnswer]] = await db.tempAnswer.update(
        { data: { ...currentAnswer.data, ...data } },
        {
          returning: true,
          where: {
            [Op.and]: [{ programme: room }, { year: await whereDraftYear() }],
          },
        }
      )
      socket.to(room).emit('new_form_data', updatedAnswer.data)
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const getLock = async (socket, payload, io) => {
  const { field, room } = payload
  const currentUser = await getCurrentUser(socket)

  if (currentEditors[room] && currentEditors[room][field]) return

  const timeoutId = setTimeout(() => {
    currentEditors = {
      ...currentEditors,
      [room]: { ...currentEditors[room], [field]: undefined },
    }
    io.in(room).emit('update_editors', stripTimeouts(currentEditors[room]))
  }, 15000)

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

  io.in(room).emit('update_editors', stripTimeouts(currentEditors[room]))
}

module.exports = {
  joinRoom,
  leaveRoom,
  updateField,
  getLock,
}
