'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  AlertTriangle,
  Package,
  Calendar
} from 'lucide-react'

// Mock data - will be replaced with API calls
const initialInventory = [
  {
    id: '1',
    product: 'Product A',
    sku: 'SKU-001',
    category: 'Electronics',
    quantity: 150,
    reorderLevel: 50,
    status: 'good' as const,
    expiryDate: '2025-12-31',
  },
  {
    id: '2',
    product: 'Product B',
    sku: 'SKU-002',
    category: 'Electronics',
    quantity: 30,
    reorderLevel: 40,
    status: 'low' as const,
    expiryDate: '2025-06-30',
  },
  {
    id: '3',
    product: 'Product C',
    sku: 'SKU-003',
    category: 'Accessories',
    quantity: 80,
    reorderLevel: 30,
    status: 'good' as const,
    expiryDate: '2026-01-15',
  },
  {
    id: '4',
    product: 'Product D',
    sku: 'SKU-004',
    category: 'Accessories',
    quantity: 45,
    reorderLevel: 40,
    status: 'medium' as const,
    expiryDate: '2025-08-20',
  },
  {
    id: '5',
    product: 'Product E',
    sku: 'SKU-005',
    category: 'Parts',
    quantity: 20,
    reorderLevel: 25,
    status: 'low' as const,
    expiryDate: '2025-05-10',
  },
]

export default function RetailerInventoryPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return 'success'
      case 'medium':
        return 'warning'
      case 'low':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const lowStockItems = inventory.filter(item => item.status === 'low').length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((acc, item) => acc + item.quantity, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="good">Good</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">SKU</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium">Reorder Level</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.product}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.sku}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">
                      <span className={item.status === 'low' ? 'text-red-600 font-bold' : ''}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{item.reorderLevel}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadge(item.status) as any}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {item.expiryDate}
                      </div>
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
