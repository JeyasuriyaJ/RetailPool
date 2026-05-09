'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  DollarSign
} from 'lucide-react'

type Mode = 'buy' | 'sell'

// Mock data for Buy Mode (Retailer view)
const buyModeStats = [
  { title: 'My Orders', value: '45', change: '+12%', trend: 'up' },
  { title: 'Total Spend', value: '₹12,450', change: '+8%', trend: 'up' },
  { title: 'Pending Orders', value: '8', change: '-5%', trend: 'down' },
  { title: 'Low Stock Items', value: '5', change: '+2', trend: 'up' },
]

// Mock data for Sell Mode (Distributor view)
const sellModeStats = [
  { title: 'Retailer Orders', value: '156', change: '+15%', trend: 'up' },
  { title: 'Revenue', value: '₹45,678', change: '+22%', trend: 'up' },
  { title: 'Pending Shipments', value: '23', change: '-8%', trend: 'down' },
  { title: 'Active Retailers', value: '42', change: '+5', trend: 'up' },
]

export default function SubdistributorDashboardPage() {
  const [mode, setMode] = useState<Mode>('buy')

  const stats = mode === 'buy' ? buyModeStats : sellModeStats

  return (
    <div className="space-y-6">
      {/* Dual Mode Toggle */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome Back!</h2>
              <p className="text-blue-100">
                You're a sub-distributor. Toggle between Buy and Sell modes.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                <Button
                  variant={mode === 'buy' ? 'secondary' : 'ghost'}
                  onClick={() => setMode('buy')}
                  className={mode === 'buy' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Buy Mode
                </Button>
                <Button
                  variant={mode === 'sell' ? 'secondary' : 'ghost'}
                  onClick={() => setMode('sell')}
                  className={mode === 'sell' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'}
                >
                  Sell Mode
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Banner */}
      <div className={`p-4 rounded-lg border ${
        mode === 'buy' 
          ? 'bg-green-50 border-green-200' 
          : 'bg-purple-50 border-purple-200'
      }`}>
        <div className="flex items-center gap-3">
          {mode === 'buy' ? (
            <>
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Buy Mode Active</h3>
                <p className="text-sm text-green-700">
                  View orders from your perspective as a retailer buying from distributors
                </p>
              </div>
            </>
          ) : (
            <>
              <DollarSign className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">Sell Mode Active</h3>
                <p className="text-sm text-purple-700">
                  View orders from your perspective as a distributor selling to retailers
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {mode === 'buy' ? (
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              ) : (
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              )}
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
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Net Inventory Card - Special for Subdistributor */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Net Inventory Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Incoming */}
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownRight className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Incoming</span>
                </div>
                <p className="text-2xl font-bold text-green-600">450 units</p>
                <p className="text-sm text-green-700">From distributors</p>
              </div>

              {/* Outgoing */}
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Outgoing</span>
                </div>
                <p className="text-2xl font-bold text-red-600">320 units</p>
                <p className="text-sm text-red-700">To retailers</p>
              </div>

              {/* Available */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Available</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">130 units</p>
                <p className="text-sm text-blue-700">Net inventory</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'buy' ? 'Recent Purchases' : 'Recent Sales'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mode === 'buy' ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #1234</p>
                      <p className="text-sm text-muted-foreground">50 units from Distributor A</p>
                    </div>
                    <Badge variant="success">Confirmed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #1235</p>
                      <p className="text-sm text-muted-foreground">30 units from Distributor B</p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #5678</p>
                      <p className="text-sm text-muted-foreground">45 units to Retail Store A</p>
                    </div>
                    <Badge variant="success">Confirmed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #5679</p>
                      <p className="text-sm text-muted-foreground">25 units to Retail Store B</p>
                    </div>
                    <Badge variant="info">Processing</Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mode === 'buy' ? (
              <>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Purchase Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  View Order History
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Retailers
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Create Batch
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
