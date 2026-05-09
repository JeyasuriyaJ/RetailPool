'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// Mock data - will be replaced with API calls
const stats = [
  {
    title: 'Total Orders',
    value: '156',
    change: '+12%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    title: 'Total Revenue',
    value: '₹45,678',
    change: '+8%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Pending Orders',
    value: '23',
    change: '-5%',
    trend: 'down',
    icon: Package,
  },
  {
    title: 'Low Stock Items',
    value: '7',
    change: '+3',
    trend: 'up',
    icon: AlertTriangle,
  },
]

const recentOrders = [
  { id: '1', product: 'Product A', quantity: 50, status: 'pending', amount: '₹1,500' },
  { id: '2', product: 'Product B', quantity: 30, status: 'confirmed', amount: '₹900' },
  { id: '3', product: 'Product C', quantity: 75, status: 'shipped', amount: '₹2,250' },
  { id: '4', product: 'Product D', quantity: 20, status: 'delivered', amount: '₹600' },
]

const aiSuggestions = [
  { product: 'Product A', suggested: 80, reason: 'Based on seasonal demand increase' },
  { product: 'Product B', suggested: 45, reason: 'Reorder point reached' },
  { product: 'Product C', suggested: 100, reason: 'Historical data suggests high demand' },
]

export default function RetailerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span>from last month</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiSuggestions.map((suggestion) => (
              <div
                key={suggestion.product}
                className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
              >
                <div>
                  <p className="font-medium">{suggestion.product}</p>
                  <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    +{suggestion.suggested}
                  </p>
                  <p className="text-xs text-muted-foreground">suggested qty</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{order.product}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {order.quantity} • {order.amount}
                    </p>
                  </div>
                  <Badge
                    variant={
                      order.status === 'delivered'
                        ? 'success'
                        : order.status === 'shipped'
                        ? 'info'
                        : order.status === 'confirmed'
                        ? 'secondary'
                        : 'warning'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
