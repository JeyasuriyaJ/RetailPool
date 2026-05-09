'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuthStore } from '@/stores'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Users, 
  MapPin,
  Truck,
  Building,
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react'

interface StoreRequest {
  id: string
  store: string
  item: string
  qty: number
  profitPerUnit: number
  status: string
  eta: string
}

export default function DistributorDashboardPage() {
  const [requests, setRequests] = useState<StoreRequest[]>([])
  
  const fetchRequests = async () => {
    try {
      const token = useAuthStore.getState().accessToken
      const res = await fetch('/api/distributor/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      // only set if array
      if (Array.isArray(data)) setRequests(data)
    } catch (e) {
      console.error("Failed fetching live requests", e)
    }
  }

  useEffect(() => {
    fetchRequests()
    // Poll to keep it feeling "live" with the DB
    const interval = setInterval(fetchRequests, 5000)
    return () => clearInterval(interval)
  }, [])
  
  const handleFulfill = async (id: string) => {
    // Optimistic UI change
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'fulfilled' } : req))
    
    try {
       const token = useAuthStore.getState().accessToken
       await fetch(`/api/distributor/fulfill/${id}`, { 
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${token}`
         }
       })
    } catch (e) {
       console.error("Fulfillment failed", e)
       // Could revert optimistic update here in production
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'processing')
  const completedRequests = requests.filter(r => r.status === 'fulfilled')
  
  const totalIncomingProfit = pendingRequests.reduce((acc, req) => acc + (req.qty * req.profitPerUnit), 0)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Distributor Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <Truck className="h-8 w-8" />
            Distributor Fulfillment Hub
          </h1>
          <p className="mt-2 text-purple-200">Manage multi-store incoming requests, track logistics, and approve bulk shipments.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-md text-center">
             <p className="text-4xl font-black">{(pendingRequests.length).toString()}</p>
             <p className="text-sm font-medium text-purple-200 uppercase tracking-wider">Active Requests</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-md text-center">
             <p className="text-4xl font-black">₹{(totalIncomingProfit).toLocaleString()}</p>
             <p className="text-sm font-medium text-purple-200 uppercase tracking-wider">Pending Batch Value</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase">Connected Stores</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-800">3 Retailers</div>
            <p className="text-xs text-muted-foreground mt-1 text-blue-600 font-medium">Actively ordering</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase">Total Volume</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-800">
              {requests.reduce((acc, req) => acc + (req.status !== 'fulfilled' ? req.qty : 0), 0)} Items
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-purple-600" />
              <span className="text-purple-600 font-medium">Pending to pack</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase">Fulfilled Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-800">{completedRequests.length} Batches</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-600 font-medium">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase">Dispatch ETA</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-800">1h 45m</div>
            <p className="text-xs text-muted-foreground mt-1 text-amber-600 font-medium">Next truck leaves soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Store Fulfillment Board */}
      <Card className="shadow-lg border-2 border-slate-100 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center justify-between">
             <div>
               <CardTitle className="text-xl text-slate-800">Pending Multi-Store Requests</CardTitle>
               <CardDescription className="mt-1">
                 Approve and fulfill localized inventory requests placed by different retailers in your network.
               </CardDescription>
             </div>
             <Button variant="outline" className="border-purple-200 hover:bg-purple-50 text-purple-700">Refresh Feed</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b sticky top-0">
              <tr>
                <th className="p-4 font-semibold text-slate-600 w-[20%]">Retailer / Store</th>
                <th className="p-4 font-semibold text-slate-600 w-[25%]">Requested Item</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Quantity</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Est. Batch Profit</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingRequests.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                     <CheckCircle2 className="mx-auto h-8 w-8 mb-2 text-green-400" />
                     All retailer requests have been fulfilled!
                   </td>
                 </tr>
              ) : (
                pendingRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        {req.store}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{req.item}</td>
                    <td className="p-4 text-right">
                      <Badge variant="outline" className="bg-white text-slate-700 font-bold px-3 py-1 text-sm border-slate-300">
                        {req.qty} units
                      </Badge>
                    </td>
                    <td className="p-4 text-right font-black text-emerald-600">
                      ₹{(req.qty * req.profitPerUnit).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={req.status === 'processing' ? 'secondary' : 'destructive'} className="uppercase tracking-wider text-[10px]">
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 font-bold transition-all hover:scale-105 shadow-md active:scale-95"
                        onClick={() => handleFulfill(req.id)}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Fulfill Request
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      {/* Recently Fulfilled Log */}
      {completedRequests.length > 0 && (
         <Card className="shadow-sm border border-green-100 bg-green-50/30">
           <CardHeader>
             <CardTitle className="text-sm font-bold text-green-800 flex items-center gap-2">
               <CheckCircle2 className="h-4 w-4" />
               Recently Fulfilled Logistics
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="flex flex-wrap gap-2">
               {completedRequests.map(req => (
                 <Badge key={req.id} variant="outline" className="bg-white border-green-200 text-green-700 py-1.5 px-3">
                   {req.store} • {req.qty}x {req.item}
                 </Badge>
               ))}
             </div>
           </CardContent>
         </Card>
      )}

    </div>
  )
}
