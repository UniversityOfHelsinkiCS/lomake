const db = require('@models/index')
const logger = require('@util/logger')
const { isSuperAdmin } = require('@root/config/common')

let currentEditors = {}

const stripTimeouts = (room) => {
  if (!room) return {}
  return Object.keys(room).reduce((acc, key) => {
    if (!room[key]) return acc
    return { ...acc, [key]: { uid: room[key].uid, name: room[key].name } }
  }, {})
}

const getCurrentUser = async (socket) => {
  const uid = socket.request.headers.uid

  if (!uid) return null

  const loggedInAs = socket.request.headers['x-admin-logged-in-as']

  if (isSuperAdmin(uid) && loggedInAs) {
    return await db.user.findOne({ where: { uid: loggedInAs } })
  }

  return await db.user.findOne({ where: { uid: uid } })
}

const joinRoom = async (socket, room) => {
  try {
    const currentUser = await getCurrentUser(socket)
    if (currentUser.admin || (currentUser.access[room] && currentUser.access[room].read)) {
      const [answer] = await db.tempAnswer.findOrCreate({
        where: {
          programme: room,
        },
        defaults: {
          data: {},
        },
      })
      socket.join(room)
      socket.emit('update_editors', stripTimeouts(currentEditors[room]))
      socket.emit('new_form_data', answer.data || {})
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const leaveRoom = (socket, room) => {
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
          [field]: { uid: currentUser.uid, name: currentUser.name, timeoutId },
        },
      }

      io.in(room).emit('update_editors', stripTimeouts(currentEditors[room]))

      const currentAnswer = await db.tempAnswer.findOne({
        where: { programme: room },
      })

      const [rows, [updatedAnswer]] = await db.tempAnswer.update(
        { data: { ...currentAnswer.data, ...data } },
        {
          returning: true,
          where: { programme: room },
        }
      )
      socket.to(room).emit('new_form_data', updatedAnswer.data)
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

module.exports = {
  joinRoom,
  leaveRoom,
  updateField,
}
