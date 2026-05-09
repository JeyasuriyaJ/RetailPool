'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores'
import { Store, Truck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  const handleRoleSelection = async (role: 'retailer' | 'distributor') => {
    try {
      setError(null)
      await login({ 
        email: `${role}@example.com`, 
        password: 'password',
        requestedRole: role 
      } as any)
      
      const { user } = useAuthStore.getState()
      if (user?.role === 'retailer') {
        router.push('/dashboard/retailer')
      } else if (user?.role === 'distributor') {
        router.push('/dashboard/distributor')
      } else {
        router.push('/dashboard/retailer')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <Card className="w-full max-w-lg shadow-2xl border-t-4 border-t-indigo-600">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-extrabold text-indigo-900">Welcome to B2B Connect</CardTitle>
          <CardDescription className="text-md mt-2">
            Select your assigned organizational persona to securely gain access to your customized dashboard environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-10">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => handleRoleSelection('retailer')}
              className="border-2 border-slate-200 p-6 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <div className="p-4 bg-slate-100 rounded-full group-hover:bg-indigo-200 transition-colors mb-4">
                <Store className="w-8 h-8 text-slate-600 group-hover:text-indigo-700" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Retailer</h3>
              <p className="text-xs text-center text-slate-500 mt-2">Manage store supply, predict item demand & view active inventory.</p>
            </div>

            <div 
              onClick={() => handleRoleSelection('distributor')}
              className="border-2 border-slate-200 p-6 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="p-4 bg-slate-100 rounded-full group-hover:bg-purple-200 transition-colors mb-4">
                <Truck className="w-8 h-8 text-slate-600 group-hover:text-purple-700" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Distributor</h3>
              <p className="text-xs text-center text-slate-500 mt-2">Fulfill multi-store demands, manage fleet batches & clear orders.</p>
            </div>
          </div>

          <div className="text-center mt-6">
             <Button variant="link" className="text-slate-400 font-normal">Need an account? Contact network admin.</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
