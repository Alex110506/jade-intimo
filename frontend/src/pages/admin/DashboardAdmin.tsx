import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- MOCK DATA PENTRU DIVERSE PERIOADE ---

const DATA_7_DAYS = [
  { name: 'Mon', value: 1200 },
  { name: 'Tue', value: 2100 },
  { name: 'Wed', value: 1800 },
  { name: 'Thu', value: 2400 },
  { name: 'Fri', value: 3200 },
  { name: 'Sat', value: 4500 },
  { name: 'Sun', value: 3800 },
];

const DATA_30_DAYS = [
  { name: 'Săpt 1', value: 15000 },
  { name: 'Săpt 2', value: 18200 },
  { name: 'Săpt 3', value: 12500 },
  { name: 'Săpt 4', value: 22000 },
];

const DATA_90_DAYS = [
  { name: 'Ian', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 68000 },
];

// Comenzi Pending (Rămân neschimbate)
const PENDING_ORDERS = [
  { id: '#ORD-7782', customer: 'Elena Popescu', date: 'Acum 2 ore', total: 345.00, items: 3 },
  { id: '#ORD-7781', customer: 'Mihai Ionescu', date: 'Acum 5 ore', total: 120.50, items: 1 },
  { id: '#ORD-7780', customer: 'Ana Maria Radu', date: 'Ieri, 23:45', total: 850.00, items: 8 },
  { id: '#ORD-7779', customer: 'Cristina Dobre', date: 'Ieri, 18:30', total: 210.00, items: 2 },
  { id: '#ORD-7778', customer: 'Vlad Dumitrescu', date: 'Ieri, 14:15', total: 55.99, items: 1 },
];

// Produse Stoc Limitat
const LOW_STOCK_ITEMS = [
  { id: 1, name: 'Sutien Dantelă Negru (S)', stock: 2, image: 'https://images.unsplash.com/photo-1582717906977-2e1d7f6c6946?q=80&w=100&auto=format&fit=crop' },
  { id: 2, name: 'Pijama Satin Roz (M)', stock: 1, image: 'https://images.unsplash.com/photo-1582717906977-2e1d7f6c6946?q=80&w=100&auto=format&fit=crop' },
  { id: 3, name: 'Halat Mătase (L)', stock: 3, image: 'https://images.unsplash.com/photo-1582717906977-2e1d7f6c6946?q=80&w=100&auto=format&fit=crop' },
];

const DashboardAdmin = () => {
  // State pentru filtru
  const [timeRange, setTimeRange] = useState('7');

  // Logică pentru a determina datele afișate pe baza filtrului
  const getDashboardData = () => {
    switch (timeRange) {
      case '30':
        return {
          chartData: DATA_30_DAYS,
          revenue: "$67,700.00",
          orders: "+2,140",
          newClients: "+450",
          changes: { rev: "+15%", ord: "+12%", cli: "+5%" }
        };
      case '90':
        return {
          chartData: DATA_90_DAYS,
          revenue: "$165,000.00",
          orders: "+6,800",
          newClients: "+1,200",
          changes: { rev: "+22%", ord: "+18%", cli: "+10%" }
        };
      case '7':
      default:
        return {
          chartData: DATA_7_DAYS,
          revenue: "$12,345.00",
          orders: "+573",
          newClients: "+124",
          changes: { rev: "+12%", ord: "+8%", cli: "-2%" }
        };
    }
  };

  const currentData = getDashboardData();

  return (
    <div className="space-y-8">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bine ai venit înapoi! Iată ce se întâmplă în magazinul tău.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-md border border-border">
            Ultima actualizare: Azi, 14:30
          </span>
        </div>
      </div>

      {/* 2. KPI Cards (Acum dinamice) */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard 
          title="Venituri Totale" 
          value={currentData.revenue} 
          change={currentData.changes.rev} 
          trend="up"
          icon={DollarSign} 
        />
        <KpiCard 
          title="Comenzi Noi" 
          value={currentData.orders} 
          change={currentData.changes.ord} 
          trend="up"
          icon={ShoppingBag} 
        />
        <KpiCard 
          title="Clienți Noi" 
          value={currentData.newClients} 
          change={currentData.changes.cli} 
          trend={timeRange === '7' ? "down" : "up"} // Exemplu de logică condițională
          icon={Users} 
        />
      </div>

      {/* 3. Charts & Stock Section */}
      <div className="grid gap-4 lg:grid-cols-7">
        
        {/* Sales Chart */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Evoluție Vânzări</h3>
            
            {/* DROPDOWN FILTRU */}
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
            >
              <option value="7">Ultimele 7 zile</option>
              <option value="30">Ultimele 30 zile</option>
              <option value="90">Ultimele 90 zile</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#ec4899', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" />
              Stoc Limitat
            </h3>
            <button className="text-sm text-pink-500 hover:underline">Vezi tot</button>
          </div>
          <div className="space-y-4">
            {LOW_STOCK_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-transparent hover:border-border transition-all">
                <div className="h-12 w-12 rounded-md overflow-hidden bg-white">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">ID: #{item.id}</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-red-600">{item.stock} buc</span>
                  <span className="text-[10px] text-muted-foreground">Rămase</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Pending Orders Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Comenzi Necesită Procesare</h3>
            <p className="text-sm text-muted-foreground">Comenzi primite care nu au fost încă expediate.</p>
          </div>
          <button className="text-sm font-medium text-foreground bg-secondary px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
            Vezi toate comenzile
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Acțiune</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                        {order.customer.charAt(0)}
                      </div>
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                    <Clock size={14} />
                    {order.date}
                  </td>
                  <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-pink-600 hover:text-pink-700 font-medium text-xs inline-flex items-center gap-1">
                      Procesează <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// --- Helper Components ---

const KpiCard = ({ title, value, change, trend, icon: Icon }: any) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-full ${isPositive ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-600'}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold">{value}</h3>
        <div className="flex items-center mt-1 text-xs">
          <span className={`flex items-center font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
            {change}
          </span>
          <span className="text-muted-foreground ml-2">față de perioada anterioară</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;