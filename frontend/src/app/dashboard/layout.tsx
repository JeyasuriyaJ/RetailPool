'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  History,
  Bell,
  LogOut,
  Menu
} from 'lucide-react'
import { useUIStore } from '@/stores'
import { useRealtimeOrders, useRealtimeInventory, useRealtimeNotifications } from '@/lib/hooks'

const retailerNavItems = [
  { href: '/dashboard/retailer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/retailer/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/retailer/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/retailer/forecast', label: 'Forecast', icon: TrendingUp },
  { href: '/dashboard/retailer/history', label: 'History', icon: History },
]

const distributorNavItems = [
  { href: '/dashboard/distributor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/distributor/batches', label: 'Batches', icon: Package },
  { href: '/dashboard/distributor/retailers', label: 'Retailers', icon: ShoppingCart },
  { href: '/dashboard/distributor/warehouse', label: 'Warehouse', icon: Package },
  { href: '/dashboard/distributor/analytics', label: 'Analytics', icon: TrendingUp },
]

const subdistributorNavItems = [
  { href: '/dashboard/subdistributor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/subdistributor/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/subdistributor/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/subdistributor/batches', label: 'Batches', icon: Package },
  { href: '/dashboard/subdistributor/analytics', label: 'Analytics', icon: TrendingUp },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  // Initialize realtime connections
  useRealtimeOrders()
  useRealtimeInventory()
  useRealtimeNotifications()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  // Redirect based on role
  useEffect(() => {
    if (user) {
      const currentPath = pathname
      
      if (user.role === 'retailer' && !currentPath.includes('/retailer')) {
        router.push('/dashboard/retailer')
      } else if (user.role === 'distributor' && !currentPath.includes('/distributor')) {
        router.push('/dashboard/distributor')
      } else if ((user.role === 'both' || user.role === 'subdistributor') && !currentPath.includes('/subdistributor')) {
        router.push('/dashboard/subdistributor')
      }
    }
  }, [user, pathname, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const getNavItems = () => {
    switch (user.role) {
      case 'retailer':
        return retailerNavItems
      case 'distributor':
        return distributorNavItems
      case 'both':
      case 'subdistributor':
        return subdistributorNavItems
      default:
        return retailerNavItems
    }
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-white border-r`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <span className="text-xl font-bold text-primary">B2B</span>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <h1 className="text-lg font-semibold">
              {navItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
