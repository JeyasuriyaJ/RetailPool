import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function RetailerHistoryPage() {
  const history = [
    { id: 'ORD-001', date: '2023-10-01', total: 1250, status: 'Delivered' },
    { id: 'ORD-002', date: '2023-10-15', total: 3400, status: 'Delivered' },
    { id: 'ORD-003', date: '2023-11-02', total: 850, status: 'Cancelled' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order History</h2>
      <Card>
        <CardHeader>
          <CardTitle>Past Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Order ID</th>
                <th className="py-2">Date</th>
                <th className="py-2">Total Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                 <tr key={item.id} className="border-b">
                   <td className="py-3">{item.id}</td>
                   <td className="py-3">{item.date}</td>
                   <td className="py-3">₹{item.total}</td>
                   <td className="py-3">
                     <Badge variant={item.status === 'Delivered' ? 'success' : 'destructive'}>{item.status}</Badge>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
