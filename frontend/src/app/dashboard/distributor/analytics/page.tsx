'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'
import { TrendingUp, ArrowUpRight, DollarSign, PackageCheck, Users } from 'lucide-react'

const monthlyData = [
  { name: 'Jan', volume: 4000, revenue: 24000 },
  { name: 'Feb', volume: 3000, revenue: 13980 },
  { name: 'Mar', volume: 2000, revenue: 9800 },
  { name: 'Apr', volume: 2780, revenue: 39080 },
  { name: 'May', volume: 1890, revenue: 48000 },
  { name: 'Jun', volume: 2390, revenue: 38000 },
  { name: 'Jul', volume: 3490, revenue: 43000 },
];

const categoryData = [
  { name: 'Grains', fill: 85 },
  { name: 'Beverages', fill: 65 },
  { name: 'Snacks', fill: 45 },
  { name: 'Oils', fill: 30 },
]

export default function DistributorAnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Analytics Overview</h2>
          <p className="text-muted-foreground mt-1">Comprehensive insights into fulfillment, revenue, and retailer performance.</p>
        </div>
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1 font-semibold text-sm">
          Last 7 Months Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-0 border-l-4 border-l-emerald-500 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                <p className="text-3xl font-black text-slate-800">₹2.4M</p>
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign className="w-5 h-5"/></div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+14.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 border-l-4 border-l-blue-500 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Fulfillment Rate</p>
                <p className="text-3xl font-black text-slate-800">98.2%</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><PackageCheck className="w-5 h-5"/></div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+2.1% improvement</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0 border-l-4 border-l-purple-500 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Retailers</p>
                <p className="text-3xl font-black text-slate-800">142</p>
              </div>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Users className="w-5 h-5"/></div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-purple-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+12 new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 border-l-4 border-l-amber-500 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg Order Value</p>
                <p className="text-3xl font-black text-slate-800">₹16.8k</p>
              </div>
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><TrendingUp className="w-5 h-5"/></div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-slate-400">
              <span>Stable compared to last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md border-slate-100">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle>Revenue & Volume Trends</CardTitle>
            <CardDescription>Monthly performance metrics across the network</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `₹${value/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-100">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle>Category Demand</CardTitle>
            <CardDescription>Fulfillment percentage by category</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6 mt-4">
              {categoryData.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-700">{category.name}</span>
                    <span className="text-slate-500">{category.fill}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${category.fill}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">Based on trailing 30 days data</p>
              <Button variant="link" className="text-indigo-600 mt-1">View Full Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}