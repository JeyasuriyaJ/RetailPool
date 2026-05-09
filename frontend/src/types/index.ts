export type UserRole = 'retailer' | 'distributor' | 'subdistributor' | 'both';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface Order {
  id: string;
  retailerId: string;
  retailerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  suggestedQuantity?: Record<string, number>;
  aiReasoning?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  reorderLevel: number;
  expiryDate?: string;
}

export interface Inventory {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  reorderLevel: number;
  status: 'low' | 'medium' | 'good';
  lastUpdated: string;
}

export interface Forecast {
  id: string;
  productId: string;
  productName: string;
  predictedDemand: number;
  confidence: number;
  reasoning: string;
  period: string;
  historicalData: ForecastDataPoint[];
}

export interface ForecastDataPoint {
  date: string;
  actual?: number;
  predicted: number;
  upperBound: number;
  lowerBound: number;
}

export interface Batch {
  id: string;
  distributorId: string;
  orders: Order[];
  status: BatchStatus;
  pickList: PickListItem[];
  createdAt: string;
  updatedAt: string;
}

export type BatchStatus = 'pending' | 'processing' | 'ready' | 'shipped' | 'delivered';

export interface PickListItem {
  productId: string;
  productName: string;
  quantity: number;
  location: string;
  picked: boolean;
}

export interface Notification {
  id: string;
  type: 'order' | 'forecast' | 'alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface StockFlow {
  incoming: number;
  outgoing: number;
  available: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
}
