// Poorly named since it only has actions

export const wsConnect = (host) => ({ type: 'WS_CONNECT', host })
export const wsConnecting = (host) => ({ type: 'WS_CONNECTING', host })
export const wsConnected = (host) => ({ type: 'WS_CONNECTED', host })
export const wsDisconnect = (host) => ({ type: 'WS_DISCONNECT', host })
export const wsDisconnected = (host) => ({ type: 'WS_DISCONNECTED', host })
export const wsJoinRoom = (room) => ({ type: 'WS_JOIN_ROOM', room })
export const wsLeaveRoom = (room) => ({ type: 'WS_LEAVE_ROOM', room })