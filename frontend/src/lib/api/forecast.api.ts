import type { Forecast } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export async function getForecasts(): Promise<Forecast[]> {
  const response = await fetch(`${API_BASE_URL}/forecasts`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch forecasts')
  }

  return response.json()
}

export async function getForecastByProductId(productId: string): Promise<Forecast> {
  const response = await fetch(`${API_BASE_URL}/forecasts/${productId}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch forecast')
  }

  return response.json()
}

export async function getForecastSummary(): Promise<{
  totalPredictedDemand: number
  averageConfidence: number
  topProducts: Forecast[]
}> {
  const response = await fetch(`${API_BASE_URL}/forecasts/summary`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch forecast summary')
  }

  return response.json()
}

export async function refreshForecasts(): Promise<Forecast[]> {
  const response = await fetch(`${API_BASE_URL}/forecasts/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to refresh forecasts')
  }

  return response.json()
}

export interface PredictInput {
  store_nbr: number;
  item_nbr: number;
  onpromotion: number;
  transactions: number;
  dcoilwtico: number;
  is_holiday: number;
}

export async function predictDemand(data: PredictInput): Promise<{ predictedDemand: number; confidence: number }> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate interactive prediction')
  }

  return response.json();
}
