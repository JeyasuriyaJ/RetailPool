'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  RefreshCw,
  Info,
  Calendar
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts'

import { predictDemand, type PredictInput } from '@/lib/api/forecast.api'

// Mock forecast data
const forecastData = [
  { date: 'Jan', actual: 120, predicted: 125, upperBound: 140, lowerBound: 110 },
  { date: 'Feb', actual: 135, predicted: 138, upperBound: 155, lowerBound: 121 },
  { date: 'Mar', actual: 142, predicted: 145, upperBound: 165, lowerBound: 125 },
  { date: 'Apr', actual: 156, predicted: 152, upperBound: 175, lowerBound: 129 },
  { date: 'May', actual: null, predicted: 160, upperBound: 185, lowerBound: 135 },
  { date: 'Jun', actual: null, predicted: 168, upperBound: 195, lowerBound: 141 },
  { date: 'Jul', actual: null, predicted: 175, upperBound: 205, lowerBound: 145 },
]

const productForecasts = [
  { 
    id: '1',
    product: 'Product A', 
    predictedDemand: 500, 
    confidence: 92, 
    reasoning: 'Based on seasonal demand patterns and recent sales growth',
    trend: 'up' as const
  },
  { 
    id: '2',
    product: 'Product B', 
    predictedDemand: 320, 
    confidence: 85, 
    reasoning: 'Stable demand with slight seasonal variation',
    trend: 'stable' as const
  },
  { 
    id: '3',
    product: 'Product C', 
    predictedDemand: 180, 
    confidence: 78, 
    reasoning: 'Declining trend observed, consider reducing inventory',
    trend: 'down' as const
  },
]

export default function RetailerForecastPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(productForecasts[0])
  
  // Interactive Sandbox State
  const [customInput, setCustomInput] = useState<PredictInput>({
    store_nbr: 1,
    item_nbr: 1,
    onpromotion: 0,
    transactions: 1500,
    dcoilwtico: 55.4,
    is_holiday: 0,
  })
  const [sandboxResult, setSandboxResult] = useState<{ predictedDemand: number; confidence: number } | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const handlePredict = async () => {
    setIsPredicting(true)
    try {
      const result = await predictDemand(customInput)
      setSandboxResult(result)
    } catch (error) {
      console.error(error)
    } finally {
      setIsPredicting(false)
    }
  }

  const handleInputChange = (field: keyof PredictInput, value: string) => {
    setCustomInput(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↑'
    if (trend === 'down') return '↓'
    return '→'
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-600'
  }


// Financial Sandbox Configuration
  const [itemsList] = useState([
    { id: 1, name: 'India Gate Basmati Rice (5kg)', quantityLeft: 12, neededForFuture: 50, unitProfit: 200 },
    { id: 2, name: 'Aashirvaad Atta (10kg)', quantityLeft: 30, neededForFuture: 100, unitProfit: 85 },
    { id: 3, name: 'Tata Tea Gold (500g)', quantityLeft: 22, neededForFuture: 80, unitProfit: 35 },
    { id: 4, name: 'Amul Butter (500g)', quantityLeft: 15, neededForFuture: 60, unitProfit: 25 },
    { id: 5, name: 'MDH Garam Masala (100g)', quantityLeft: 45, neededForFuture: 150, unitProfit: 15 },
    { id: 6, name: 'Toor Dal (1kg)', quantityLeft: 10, neededForFuture: 90, unitProfit: 40 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = itemsList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Demand Forecast</h2>
          <p className="text-muted-foreground">AI-powered demand predictions</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Forecasts'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Across all products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Predicted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,000 units</div>
            <p className="text-xs text-muted-foreground">Next 3 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 products</div>
            <p className="text-xs text-muted-foreground">Above 90% confidence</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Forecast Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Demand Trend - {selectedProduct.product}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="upperBound" 
                    stroke="transparent" 
                    fill="#3b82f6" 
                    fillOpacity={0.1}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lowerBound" 
                    stroke="transparent" 
                    fill="white" 
                    fillOpacity={1}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e' }}
                    name="Actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#3b82f6' }}
                    name="Predicted"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Actual Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Predicted Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-3 rounded bg-blue-100"></div>
                <span>Confidence Band</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Forecast List */}
        <Card>
          <CardHeader>
            <CardTitle>Product Forecasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productForecasts.map((product) => (
              <div
                key={product.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedProduct.id === product.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{product.product}</span>
                  <span className={`text-lg ${getTrendColor(product.trend)}`}>
                    {getTrendIcon(product.trend)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {product.predictedDemand} units
                  </span>
                  <span className={`font-medium ${getConfidenceColor(product.confidence)}`}>
                    {product.confidence}% confidence
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Selected Product Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Forecast Reasoning - {selectedProduct.product}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-900">{selectedProduct.reasoning}</p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Predicted Demand</p>
              <p className="text-xl font-bold">{selectedProduct.predictedDemand} units</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Confidence Level</p>
              <p className={`text-xl font-bold ${getConfidenceColor(selectedProduct.confidence)}`}>
                {selectedProduct.confidence}%
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Trend</p>
              <p className={`text-xl font-bold ${getTrendColor(selectedProduct.trend)}`}>
                {selectedProduct.trend === 'up' ? 'Increasing' : 
                 selectedProduct.trend === 'down' ? 'Decreasing' : 'Stable'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory & Projection Table Component */}
      <Card className="border-indigo-200 border-2 overflow-hidden shadow-lg mt-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Inventory Profit Projections
            </h2>
            <p className="text-indigo-100 mt-1">Easily search your predefined stock data to project profits.</p>
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="🔍 Search for an item..." 
              className="w-full p-2 pl-4 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Item Name</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Quantity Left</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Needed For Future</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Profit per Unit</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Est. Total Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No items found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-right text-gray-600">{item.quantityLeft} units</td>
                    <td className="p-4 text-right">
                      <Badge variant={item.neededForFuture > 0 ? "default" : "secondary"}>
                        {item.neededForFuture} units
                      </Badge>
                    </td>
                    <td className="p-4 text-right text-gray-600 font-medium">₹{item.unitProfit}</td>
                    <td className="p-4 text-right font-bold text-green-600">
                      ₹{(item.neededForFuture * item.unitProfit).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  )
}

