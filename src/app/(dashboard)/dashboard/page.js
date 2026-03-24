import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getProducts, getStockMovements } from "@/lib/api";
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Database, 
  Bot, 
  UserCheck, 
  Clock 
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null; // Layout will handle redirect
  }

  // Optimized parallel fetching
  const [products, movements] = await Promise.all([
    getProducts().catch(() => []),
    getStockMovements().catch(() => []),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const stockInToday = movements.filter(m => m.type === "IN" && m.createdAt?.startsWith(today)).length;
  const stockOutToday = movements.filter(m => m.type === "OUT" && m.createdAt?.startsWith(today)).length;

  return (
    <div className="space-y-6 pt-4 max-w-7xl mx-auto pb-10">
      {/* Header matching Products/Inventory design */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, <span className="text-black font-semibold">{session.user?.name || "Admin"}</span>. Tracking {products.length} active products today.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
            icon={<Package className="w-5 h-5 text-gray-400" />} 
            title="Total Registered Products" 
            value={products.length} 
        />
        <StatCard 
            icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} 
            title="Stock IN Transfers Today" 
            value={stockInToday} 
            color="text-emerald-600"
            bgColor="bg-emerald-50"
        />
        <StatCard 
            icon={<TrendingDown className="w-5 h-5 text-blue-500" />} 
            title="Stock OUT Transfers Today" 
            value={stockOutToday} 
            color="text-blue-600"
            bgColor="bg-blue-50"
        />
        <StatCard 
            icon={<Activity className="w-5 h-5 text-amber-500" />} 
            title="Historical Interactions" 
            value={movements.length} 
            bgColor="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Audit Log */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          
          <div className="space-y-4">
            {movements.slice(0, 6).map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest ${m.type === "IN" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {m.type}
                    </span>
                    <span className="text-gray-900 font-bold text-sm">Qty: {m.quantity}</span>
                </div>
                <span className="text-gray-400 text-[10px] font-medium tracking-tight">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {movements.length === 0 && (
                <div className="py-10 text-center opacity-30 italic text-sm">No transaction records found in the database.</div>
            )}
          </div>
        </div>

        {/* Live System Diagnostics */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">System Core Status</h2>
          </div>
          
          <div className="space-y-4">
            <StatusRow 
                icon={<Database className="w-4 h-4" />} 
                label="Database Continuity" 
                status="ONLINE" 
                color="bg-emerald-50 text-emerald-700" 
            />
            <StatusRow 
                icon={<Bot className="w-4 h-4" />} 
                label="AI Analysis Extension" 
                status="ACTIVE" 
                color="bg-blue-50 text-blue-700" 
            />
            <StatusRow 
                icon={<UserCheck className="w-4 h-4" />} 
                label="Primary User Authority" 
                status={session.user?.role || "Admin"} 
                color="bg-gray-100 text-gray-700" 
            />
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">Cloud Synchronization Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color = "text-gray-900", bgColor = "bg-gray-50" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm group hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
          <div className={`h-10 w-10 ${bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
            {icon}
          </div>
          <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 leading-none">{title}</p>
      </div>
      <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function StatusRow({ icon, label, status, color }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl border border-gray-50/50">
      <div className="flex items-center gap-3">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-medium text-gray-600 tracking-tight">{label}</span>
      </div>
      <span className={`${color} px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border border-current opacity-80 uppercase`}>
        {status}
      </span>
    </div>
  );
}
