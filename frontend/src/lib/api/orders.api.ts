import type { Order, OrderItem } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }

  return response.json()
}

export async function getOrderById(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch order')
  }

  return response.json()
}

export async function createOrder(items: OrderItem[]): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ items }),
  })

  if (!response.ok) {
    throw new Error('Failed to create order')
  }

  return response.json()
}

export async function updateOrder(id: string, items: OrderItem[]): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ items }),
  })

  if (!response.ok) {
    throw new Error('Failed to update order')
  }

  return response.json()
}

export async function confirmOrder(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/confirm`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to confirm order')
  }

  return response.json()
}

export async function cancelOrder(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to cancel order')
  }

  return response.json()
}
