'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Edit2, 
  Check,
  X,
  Lightbulb
} from 'lucide-react'

// Mock data - will be replaced with API calls
const initialOrders = [
  {
    id: '1',
    product: 'Product A',
    currentQty: 50,
    suggestedQty: 80,
    unitPrice: 30,
    status: 'pending',
    aiReasoning: 'Based on seasonal demand increase',
  },
  {
    id: '2',
    product: 'Product B',
    currentQty: 30,
    suggestedQty: 45,
    unitPrice: 25,
    status: 'pending',
    aiReasoning: 'Reorder point reached',
  },
  {
    id: '3',
    product: 'Product C',
    currentQty: 75,
    suggestedQty: 100,
    unitPrice: 35,
    status: 'confirmed',
    aiReasoning: 'Historical data suggests high demand',
  },
  {
    id: '4',
    product: 'Product D',
    currentQty: 20,
    suggestedQty: 35,
    unitPrice: 40,
    status: 'pending',
    aiReasoning: 'Trending product in your region',
  },
]

export default function RetailerOrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [showReasoning, setShowReasoning] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleEdit = (id: string, currentQty: number) => {
    setEditingId(id)
    setEditValue(currentQty)
  }

  const handleSave = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, currentQty: editValue } : order
    ))
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleConfirm = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'confirmed' } : order
    ))
  }

  const filteredOrders = orders.filter(order => 
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDiffColor = (current: number, suggested: number) => {
    if (suggested > current) return 'text-green-600 bg-green-50'
    if (suggested < current) return 'text-red-600 bg-red-50'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* AI Suggestion Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">AI-Powered Ordering</h3>
              <p className="text-sm text-blue-700">
                Our AI analyzes your sales history, seasonal trends, and market data to suggest optimal quantities.
                Green values indicate suggested increases, red indicates decreases.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">Current Qty</th>
                  <th className="text-left py-3 px-4 font-medium">AI Suggested</th>
                  <th className="text-left py-3 px-4 font-medium">Unit Price</th>
                  <th className="text-left py-3 px-4 font-medium">Total</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.product}</td>
                    <td className="py-3 px-4">
                      {editingId === order.id ? (
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      ) : (
                        <span>{order.currentQty}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded ${getDiffColor(order.currentQty, order.suggestedQty)}`}>
                          {order.suggestedQty}
                        </span>
                        <button
                          onClick={() => setShowReasoning(showReasoning === order.id ? null : order.id)}
                          className="text-muted-foreground hover:text-primary"
                          title={order.aiReasoning}
                        >
                          <Lightbulb className="h-4 w-4" />
                        </button>
                      </div>
                      {showReasoning === order.id && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                          {order.aiReasoning}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">₹{order.unitPrice}</td>
                    <td className="py-3 px-4">
                      ₹{editingId === order.id ? editValue * order.unitPrice : order.currentQty * order.unitPrice}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          order.status === 'confirmed' ? 'success' :
                          order.status === 'pending' ? 'warning' : 'secondary'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {editingId === order.id ? (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => handleSave(order.id)}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={handleCancel}>
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(order.id, order.currentQty)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {order.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleConfirm(order.id)}
                              >
                                Confirm
                              </Button>
                            )}
                          </>
                        )}
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
