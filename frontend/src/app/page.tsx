'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else if (user) {
      // Redirect based on role
      if (user.role === 'retailer') {
        router.push('/dashboard/retailer')
      } else if (user.role === 'distributor') {
        router.push('/dashboard/distributor')
      } else if (user.role === 'both' || user.role === 'subdistributor') {
        router.push('/dashboard/subdistributor')
      } else {
        router.push('/dashboard/retailer')
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
