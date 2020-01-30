import { wsConnected, wsDisconnected } from 'Utilities/redux/websocketReducer'
import { basePath } from 'Utilities/common'
import io from 'socket.io-client'

const connect = () => {
  return io(basePath)
}

const socketMiddleware = () => {
  let socket = null

  const updateForm = (store) => (event) => {
    store.dispatch(({ type: 'GET_FORM_SUCCESS', response: event }))
  }

  // the middleware part of this function
  return (store) => (next) => (action) => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== null) socket.close()

        socket = connect()
        // websocket handlers
        socket.on('new_form_data', updateForm(store))

        break
      case 'WS_DISCONNECT':
        if (socket !== null) socket.close()

        socket = null
        break
      case 'UPDATE_FORM_FIELD':
        if (!socket) socket = connect()

        socket.emit('update_field', { [action.field]: action.value })
        break
      default:
        break
    }
    next(action)
  }
}

export default socketMiddleware()