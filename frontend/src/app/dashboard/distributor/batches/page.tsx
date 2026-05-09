'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Truck, Layers, CheckCircle2, MoreVertical, Clock } from 'lucide-react'

interface Batch {
  id: string
  date: string
  retailerCount: number
  items: number
  totalValue: number
  status: 'Pending Review' | 'Processing' | 'In Transit' | 'Delivered'
}

export default function DistributorBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([
    { id: 'B-8492', date: '2026-05-08', retailerCount: 14, items: 450, totalValue: 84500, status: 'Pending Review' },
    { id: 'B-8491', date: '2026-05-08', retailerCount: 8, items: 120, totalValue: 24000, status: 'Processing' },
    { id: 'B-8490', date: '2026-05-07', retailerCount: 22, items: 980, totalValue: 185000, status: 'In Transit' },
    { id: 'B-8489', date: '2026-05-06', retailerCount: 18, items: 640, totalValue: 120000, status: 'Delivered' },
  ])

  const handleApprove = (id: string) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, status: 'Processing' } : b))
  }

  const handleDispatch = (id: string) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, status: 'In Transit' } : b))
  }

  const getStatusBadge = (status: Batch['status']) => {
    switch (status) {
      case 'Pending Review': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
      case 'Processing': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Layers className="w-3 h-3 mr-1" /> Processing</Badge>
      case 'In Transit': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><Truck className="w-3 h-3 mr-1" /> In Transit</Badge>
      case 'Delivered': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Batch Management</h2>
          <p className="text-muted-foreground mt-1">Review, approve, and dispatch aggregated multi-retailer batches.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 shadow-md">
          <Layers className="mr-2 h-4 w-4" />
          Create Custom Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-purple-100 uppercase tracking-wider text-xs">Total Active Batches</h3>
            <p className="text-4xl font-black mt-2">
              {batches.filter(b => b.status !== 'Delivered').length}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <h3 className="font-bold text-slate-500 text-sm">Pending Value</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              ₹{batches.filter(b => b.status === 'Pending Review').reduce((acc, b) => acc + b.totalValue, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <h3 className="font-bold text-slate-500 text-sm">Items In Transit</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {batches.filter(b => b.status === 'In Transit').reduce((acc, b) => acc + b.items, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-slate-100 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-xl">Active Logistic Batches</CardTitle>
          <CardDescription>All auto-generated and manual batches for fulfillment.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="p-4 font-semibold">Batch ID</th>
                  <th className="p-4 font-semibold">Date Created</th>
                  <th className="p-4 font-semibold text-center">Retailers Included</th>
                  <th className="p-4 font-semibold text-center">Total Items</th>
                  <th className="p-4 font-semibold text-right">Batch Value</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map(v => (
                   <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="p-4">
                       <div className="flex items-center gap-2">
                         <div className="p-2 bg-purple-100 rounded text-purple-700">
                           <Package className="w-4 h-4" />
                         </div>
                         <span className="font-bold text-slate-800">{v.id}</span>
                       </div>
                     </td>
                     <td className="p-4 text-slate-600">{v.date}</td>
                     <td className="p-4 text-center">
                       <Badge variant="secondary" className="font-bold">{v.retailerCount}</Badge>
                     </td>
                     <td className="p-4 text-center font-medium">{v.items}</td>
                     <td className="p-4 text-right font-black text-emerald-600">₹{v.totalValue.toLocaleString()}</td>
                     <td className="p-4 text-center">{getStatusBadge(v.status)}</td>
                     <td className="p-4 text-right">
                        {v.status === 'Pending Review' && (
                          <Button size="sm" onClick={() => handleApprove(v.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white">Approve</Button>
                        )}
                        {v.status === 'Processing' && (
                          <Button size="sm" onClick={() => handleDispatch(v.id)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">Dispatch <Truck className="ml-2 w-3 h-3"/></Button>
                        )}
                        {v.status === 'In Transit' && (
                          <Button size="icon" variant="ghost" className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4"/></Button>
                        )}
                        {v.status === 'Delivered' && (
                          <span className="text-slate-400 text-xs font-medium mr-2">Completed</span>
                        )}
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}