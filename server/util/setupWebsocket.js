// Note that I didn't bother to setup hot loading here.

let formData = {

}

const setupWebsocket = (socket) => {
  console.log('connection')
  socket.emit('new_form_data', formData)

  socket.on('update_field', (data) => {
    formData = {
      ...formData,
      ...data
    }
    console.log('Updated formdata', formData)
    socket.broadcast.emit('new_form_data', formData)
  })
}

module.exports = setupWebsocket