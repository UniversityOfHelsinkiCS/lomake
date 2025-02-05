import { Server } from 'socket.io'
import websocketHandlers from './util/websocketHandlers.js'

let io = null

const createWebsocketServer = server => {
  io = new Server(server)
  io.on('connection', socket => {
    socket.on('update_field', room => websocketHandlers.updateField(socket, room, io))
    socket.on('join', (room, form) => websocketHandlers.joinRoom(socket, room, form, io))
    socket.on('leave', room => websocketHandlers.leaveRoom(socket, room))
  })
}

export const getLockForHttp = (cuser, room) => websocketHandlers.getLockHttp(cuser, room, io)
export const updateWebsocketState = (cuser, room) => websocketHandlers.updateWebsocketState(cuser, room, io)

export default createWebsocketServer
