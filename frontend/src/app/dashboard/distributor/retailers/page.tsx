'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, TrendingUp, Star, Phone, Mail, MoreHorizontal, Filter } from 'lucide-react'

interface Retailer {
  id: string
  name: string
  location: string
  type: string
  activeOrders: number
  lifetimeVolume: number
  status: 'Active' | 'Warning' | 'Inactive'
  rating: number
}

export default function DistributorRetailersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const retailers: Retailer[] = [
    { id: 'R-001', name: 'Fresh Mart Supermarket', location: 'Downtown Market', type: 'Supermarket', activeOrders: 3, lifetimeVolume: 1250000, status: 'Active', rating: 4.8 },
    { id: 'R-002', name: 'Corner Grocery Store', location: 'Eastside', type: 'Kirana', activeOrders: 1, lifetimeVolume: 450000, status: 'Active', rating: 4.5 },
    { id: 'R-003', name: 'City Center Provisions', location: 'City Center Mall', type: 'Supermarket', activeOrders: 0, lifetimeVolume: 890000, status: 'Warning', rating: 3.9 },
    { id: 'R-004', name: 'QuickStop Convenience', location: 'Highway 42', type: 'Convenience', activeOrders: 5, lifetimeVolume: 2100000, status: 'Active', rating: 4.9 },
    { id: 'R-005', name: 'Daily Needs Grocery', location: 'Westend', type: 'Kirana', activeOrders: 0, lifetimeVolume: 120000, status: 'Inactive', rating: 4.1 },
    { id: 'R-006', name: 'Green Valley Organics', location: 'North Hills', type: 'Specialty', activeOrders: 2, lifetimeVolume: 670000, status: 'Active', rating: 4.7 },
  ]

  const filteredRetailers = retailers.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.location.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Retailer Network</h2>
          <p className="text-muted-foreground mt-1">Manage and monitor all connected stores in your distribution network.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search retailers..." 
              className="pl-9 bg-white border-slate-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shadow-sm border-slate-200">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRetailers.map((retailer) => (
          <Card key={retailer.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow group">
            <div className={`h-2 w-full ${retailer.status === 'Active' ? 'bg-green-500' : retailer.status === 'Warning' ? 'bg-amber-500' : 'bg-slate-300'}`} />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-purple-700 transition-colors">{retailer.name}</h3>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {retailer.location}
                  </div>
                </div>
                <Badge variant="outline" className="bg-slate-50">{retailer.type}</Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Orders</p>
                  <p className="text-xl font-black text-slate-800 mt-1 flex items-center">
                    {retailer.activeOrders}
                    {retailer.activeOrders > 0 && <span className="flex h-2 w-2 ml-2 rounded-full bg-blue-500 animate-pulse" />}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">LTV</p>
                  <p className="text-lg font-black text-emerald-600 mt-1 flex items-center">
                    ₹{(retailer.lifetimeVolume / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm font-bold text-slate-700">{retailer.rating}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-purple-600 bg-slate-50 hover:bg-purple-50">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-purple-600 bg-slate-50 hover:bg-purple-50">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRetailers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-slate-200">
          <Search className="mx-auto h-10 w-10 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No retailers found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  )
}