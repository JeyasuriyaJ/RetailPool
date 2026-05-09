import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    const token = useAuthStore.getState().accessToken
    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000', {
      autoConnect: false,
      withCredentials: true,
      auth: { token: token }
    })
  }
  return socket
}

export const connectSocket = (): void => {
  const socket = getSocket()
  if (!socket.connected) {
    socket.connect()
  }
}

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export const subscribeToEvent = (event: string, callback: (...args: unknown[]) => void): void => {
  const socket = getSocket()
  socket.on(event, callback)
}

export const unsubscribeFromEvent = (event: string): void => {
  const socket = getSocket()
  socket.off(event)
}
