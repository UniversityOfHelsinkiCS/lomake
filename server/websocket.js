const { updateField, joinRoom, leaveRoom, getLockHttp } = require('@util/websocketHandlers')
const ws = require('socket.io')

let io = null

const createWebsocketServer = server => {
  io = ws(server)
  io.on('connection', socket => {
    socket.on('update_field', room => updateField(socket, room, io))
    socket.on('join', (room, form) => joinRoom(socket, room, form, io))
    socket.on('leave', room => leaveRoom(socket, room))
  })
}

const getLockForHttp = (cuser, room) => getLockHttp(cuser, room, io)

module.exports = {
  createWebsocketServer,
  getLockForHttp,
}
