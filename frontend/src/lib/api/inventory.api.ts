import type { Inventory, Product } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export async function getInventory(): Promise<Inventory[]> {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch inventory')
  }

  return response.json()
}

export async function getInventoryByProductId(productId: string): Promise<Inventory> {
  const response = await fetch(`${API_BASE_URL}/inventory/${productId}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch inventory')
  }

  return response.json()
}

export async function updateInventory(productId: string, quantity: number): Promise<Inventory> {
  const response = await fetch(`${API_BASE_URL}/inventory/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ quantity }),
  })

  if (!response.ok) {
    throw new Error('Failed to update inventory')
  }

  return response.json()
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return response.json()
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  return response.json()
}

export async function getLowStockItems(): Promise<Inventory[]> {
  const response = await fetch(`${API_BASE_URL}/inventory/low-stock`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch low stock items')
  }

  return response.json()
}
