// Note that I didn't bother to setup hot loading here.

let formData = {}

const joinRoom = (socket, room) => {
  console.log('JOINED!')
  socket.join(room)
  socket.emit('new_form_data', formData[room] || {})
}

const leaveRoom = (socket, room) => {
  console.log('leave')
  socket.leave(room)
  socket.emit('left_success', 'ok')
}

const updateField = (socket, payload) => {
  console.log(payload)
  const { room, data } = payload
  formData = {
    ...formData,
    [room]: {
      ...formData[room],
      ...data
    }
  }
  socket.to(room).emit('new_form_data', formData[room])
}

module.exports = {
  joinRoom,
  leaveRoom,
  updateField
}
