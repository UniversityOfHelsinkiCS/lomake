import io from 'socket.io-client'
import Cookies from 'js-cookie'
import { basePath, inProduction } from './common'
import { getHeaders } from '../../config/mockHeaders'
// eslint-disable-next-line import/no-cycle
import store from './store'

const connect = () => {
  const headers = !inProduction ? { ...getHeaders() } : {}

  const adminLoggedInAs = localStorage.getItem('adminLoggedInAs')

  if (adminLoggedInAs) headers['x-admin-logged-in-as'] = adminLoggedInAs

  // Set the 'uid' cookie with a values
  // when using websocket you have to pass uid as cookies to backend because extraHeaders are not supported
  Cookies.set('uid', headers.uid, { expires: 7 }) // Expires in 7 days
  Cookies.set('x-admin-logged-in-as', adminLoggedInAs, { expires: 7 })

  return io(window.origin, {
    path: `${basePath}socket.io`,
    transports: ['polling'],
    extraHeaders: headers,
  })
}
const updateForm = store => event => {
  store.dispatch({ type: 'GET_FORM_SUCCESS', response: event })
}
const updateEditors = store => event => {
  store.dispatch({ type: 'UPDATE_CURRENT_EDITORS', value: event })
}

export const setupSocketListeners = socket => {
  if (!window.location.href.endsWith('/individual')) {
    socket.on('new_form_data', updateForm(store))
    socket.on('update_editors', updateEditors(store))
  }
}

const socketMiddleware = () => {
  let socket = null
  let isVisible = true

  const handleVisibilityChange = () => {
    isVisible = !document.hidden
    if (isVisible && !socket) {
      const pathParts = window.location.pathname.split('/')
      const room = pathParts[pathParts.length - 1]
      const form = pathParts[pathParts.length - 2]

      socket = connect()
      setupSocketListeners(socket)
      socket.emit('join', room, form)
    } else if (!isVisible && socket) {
      socket.close()
      socket = null
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  // the middleware part of this function
  return store => next => action => {
    const { room } = store.getState()

    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== null) socket.close()

        socket = connect()
        setupSocketListeners(socket)

        break
      case 'WS_LEAVE_ROOM':
        if (!socket) socket = connect() // This really only happens when developing.

        socket.emit('leave', action.room)
        break
      case 'WS_JOIN_ROOM':
        if (!socket) socket = connect()

        socket.emit('join', action.room, action.form)
        break
      case 'WS_DISCONNECT':
        if (socket !== null) socket.close()

        socket = null
        break
      case 'UPDATE_FORM_FIELD':
        if (!socket) socket = connect()

        socket.emit('update_field', {
          data: { [action.field]: action.value },
          room,
          form: action.form,
        })
        break
      case 'GET_LOCK':
        if (!socket) socket = connect()

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
