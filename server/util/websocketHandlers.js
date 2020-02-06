const db = require('@models/index')
const logger = require('@util/logger')

const joinRoom = async (socket, room) => {
  try {
    const [answer] = await db.tempAnswer.findOrCreate({
      where: {
        programme: room
      },
      defaults: {
        data: {}
      }
    })
    socket.join(room)
    socket.emit('new_form_data', answer.data || {})
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const leaveRoom = (socket, room) => {
  socket.leave(room)
  socket.emit('left_success', 'ok')
}

const updateField = async (socket, payload) => {
  try {
    const { room, data } = payload

    const currentAnswer = await db.tempAnswer.findOne({
      where: { programme: room }
    })

    const [rows, [updatedAnswer]] = await db.tempAnswer.update(
      { data: { ...currentAnswer.data, ...data } },
      {
        returning: true,
        where: { programme: room }
      }
    )
    socket.to(room).emit('new_form_data', updatedAnswer)
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

module.exports = {
  joinRoom,
  leaveRoom,
  updateField
}
