import { basePath, inProduction } from 'Utilities/common'
import { getHeaders } from 'Utilities/mockHeaders'
import io from 'socket.io-client'

const connect = () => {
  const defaultHeaders = !inProduction ? getHeaders() : {}
  const headers = { ...defaultHeaders }

  const adminLoggedInAs = localStorage.getItem('adminLoggedInAs') // uid
  if (adminLoggedInAs) headers['x-admin-logged-in-as'] = adminLoggedInAs

  return io(window.origin, {
    path: `${basePath}socket.io`,
    transports: ['polling'],
    transportOptions: {
      polling: {
        extraHeaders: headers,
      },
    },
  })
}

const socketMiddleware = () => {
  let socket = null

  const updateForm = store => event => {
    store.dispatch({ type: 'GET_FORM_SUCCESS', response: event })
  }
  const updateEditors = store => event => {
    store.dispatch({ type: 'UPDATE_CURRENT_EDITORS', value: event })
  }

  // the middleware part of this function
  return store => next => action => {
    const { room } = store.getState()
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== null) socket.close()

        socket = connect()
        // websocket handlers
        socket.on('new_form_data', updateForm(store))
        socket.on('update_editors', updateEditors(store))
        break
      case 'WS_LEAVE_ROOM':
        if (!socket) socket = connect() // This really only happens when developing.

        socket.emit('leave', action.room)
        break
      case 'WS_JOIN_ROOM':
        if (!socket) socket = connect() // This really only happens when developing.

        socket.emit('join', action.room)
        break
      case 'WS_DISCONNECT':
        if (socket !== null) socket.close()

        socket = null
        break
      case 'UPDATE_FORM_FIELD':
        if (!socket) socket = connect() // This really only happens when developing.

        socket.emit('update_field', {
          data: { [action.field]: action.value },
          room,
        })
        break
      case 'GET_LOCK':
        if (!socket) socket = connect() // This really only happens when developing.

        socket.emit('get_lock', {
          field: action.field,
          room,
        })
        break
      default:
        break
    }

    next(action)
  }
}

export default socketMiddleware()
