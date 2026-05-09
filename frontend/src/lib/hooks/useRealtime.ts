'use client'

import { useEffect } from 'react'
import { connectSocket, disconnectSocket, subscribeToEvent, unsubscribeFromEvent } from '@/lib/realtime/socket'
import { useNotificationStore } from '@/stores'

export function useRealtimeOrders() {
  useEffect(() => {
    connectSocket()

    const handleNewOrder = (order: unknown) => {
      useNotificationStore.getState().addNotification({
        type: 'order',
        title: 'New Order',
        message: `New order received: ${JSON.stringify(order)}`,
        read: false,
      })
    }

    subscribeToEvent('new-order', handleNewOrder)

    return () => {
      unsubscribeFromEvent('new-order')
      disconnectSocket()
    }
  }, [])
}

export function useRealtimeInventory() {
  useEffect(() => {
    connectSocket()

    const handleInventoryUpdate = (data: unknown) => {
      useNotificationStore.getState().addNotification({
        type: 'alert',
        title: 'Inventory Update',
        message: `Inventory updated: ${JSON.stringify(data)}`,
        read: false,
      })
    }

    subscribeToEvent('inventory-update', handleInventoryUpdate)

    return () => {
      unsubscribeFromEvent('inventory-update')
    }
  }, [])
}

export function useRealtimeNotifications() {
  useEffect(() => {
    connectSocket()

    const handleNotification = (notification: unknown) => {
      useNotificationStore.getState().addNotification({
        type: 'alert',
        title: 'Notification',
        message: JSON.stringify(notification),
        read: false,
      })
    }

    subscribeToEvent('notification', handleNotification)

    return () => {
      unsubscribeFromEvent('notification')
    }
  }, [])
}
