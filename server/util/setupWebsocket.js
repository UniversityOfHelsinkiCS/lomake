// Note that I didn't bother to setup hot loading here.

let formData = {

}

const setupWebsocket = (socket) => {
  socket.on('update_field', (payload) => {
    const { room, data } = payload
    formData = {
      ...formData,
      [room]: {
        ...formData[room],
        ...data
      }
    }
    socket.to(room).emit('new_form_data', formData[room])
  })

  socket.on('join', (room) => {
    socket.join(room)
    socket.emit('new_form_data', formData[room] || {})
  })
  socket.on('leave', (room) => {
    socket.leave(room)
    socket.emit('left_success', 'ok')
  })
}

module.exports = setupWebsocket