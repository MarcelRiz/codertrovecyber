import socketio from 'socket.io-client'
import React from 'react'

export const socket = socketio.connect(process.env.NEXT_PUBLIC_API, {
  rejectUnauthorized: false,
})
export const SocketContext = React.createContext()
