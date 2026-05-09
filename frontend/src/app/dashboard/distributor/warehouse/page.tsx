'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Package, Search, AlertTriangle, ArrowDownToLine, RefreshCw, Layers } from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  capacity: number
  status: 'Healthy' | 'Low' | 'Critical'
}

export default function DistributorWarehousePage() {
  const [searchTerm, setSearchTerm] = useState('')

  const inventory: InventoryItem[] = [
    { id: '1', name: 'Premium Jasmine Rice', sku: 'SKU-RICE-01', category: 'Grains', currentStock: 4500, capacity: 5000, status: 'Healthy' },
    { id: '2', name: 'Refined Sunflower Oil', sku: 'SKU-OIL-02', category: 'Oils', currentStock: 800, capacity: 4000, status: 'Low' },
    { id: '3', name: 'Whole Wheat Flour', sku: 'SKU-FLOUR-01', category: 'Grains', currentStock: 120, capacity: 3000, status: 'Critical' },
    { id: '4', name: 'Organic Green Tea', sku: 'SKU-TEA-05', category: 'Beverages', currentStock: 2100, capacity: 2500, status: 'Healthy' },
    { id: '5', name: 'Cane Sugar', sku: 'SKU-SUGAR-01', category: 'Pantry', currentStock: 3400, capacity: 4000, status: 'Healthy' },
    { id: '6', name: 'Instant Coffee', sku: 'SKU-COFFEE-02', category: 'Beverages', currentStock: 450, capacity: 2000, status: 'Low' },
  ]

  const filteredInventory = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusColor = (status: InventoryItem['status']) => {
    switch(status) {
      case 'Healthy': return 'bg-emerald-500'
      case 'Low': return 'bg-amber-500'
      case 'Critical': return 'bg-red-500'
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Warehouse Inventory</h2>
          <p className="text-muted-foreground mt-1">Real-time stock monitoring and capacity management.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="shadow-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync ERP
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Stock Inwards
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-slate-400 font-medium text-sm">Overall Capacity</p>
                 <h3 className="text-3xl font-black mt-2">68%</h3>
               </div>
               <div className="p-3 bg-white/10 rounded-lg">
                 <Layers className="h-6 w-6 text-indigo-300" />
               </div>
             </div>
             <Progress value={68} className="h-2 mt-4 bg-slate-700" indicatorClassName="bg-indigo-500" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-slate-500 font-medium text-sm">Items Low on Stock</p>
                 <h3 className="text-3xl font-black mt-2 text-amber-600">
                   {inventory.filter(i => i.status === 'Low').length}
                 </h3>
               </div>
               <div className="p-3 bg-amber-50 rounded-lg">
                 <AlertTriangle className="h-6 w-6 text-amber-500" />
               </div>
             </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
           <CardContent className="p-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-slate-500 font-medium text-sm">Total SKUs Managed</p>
                 <h3 className="text-3xl font-black mt-2 text-slate-800">
                   {inventory.length}
                 </h3>
               </div>
               <div className="p-3 bg-blue-50 rounded-lg">
                 <Package className="h-6 w-6 text-blue-500" />
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-slate-100">
        <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Inventory Directory</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search SKU or Name..." 
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold w-1/4">Stock Level</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map(item => {
                const percentage = (item.currentStock / item.capacity) * 100;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{item.name}</td>
                    <td className="p-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className={`${item.status === 'Critical' ? 'text-red-600' : item.status === 'Low' ? 'text-amber-600' : 'text-slate-600'}`}>
                            {item.currentStock.toLocaleString()} / {item.capacity.toLocaleString()}
                          </span>
                          <span>{Math.round(percentage)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" indicatorClassName={getStatusColor(item.status)} />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {item.status === 'Critical' ? (
                         <Button size="sm" variant="destructive" className="shadow-sm">Urgent Restock</Button>
                      ) : (
                         <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Reorder</Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}