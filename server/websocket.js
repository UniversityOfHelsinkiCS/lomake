const { updateField, joinRoom, leaveRoom, getLock } = require('@util/websocketHandlers')
const ws = require('socket.io')

const createWebsocketServer = server => {
  const io = ws(server)
  io.on('connection', socket => {
    socket.on('update_field', room => updateField(socket, room, io))
    socket.on('join', (room, form) => joinRoom(socket, room, form, io))
    socket.on('leave', room => leaveRoom(socket, room))
    socket.on('get_lock', room => getLock(socket, room, io))
  })
}

module.exports = { createWebsocketServer }
