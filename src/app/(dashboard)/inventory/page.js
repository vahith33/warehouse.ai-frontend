"use client";

import { useEffect, useState } from "react";
import { getAllInventory } from "@/lib/api";
import { Package, AlertTriangle, Boxes, CheckCircle, RefreshCcw } from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllInventory();
      setInventory(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to retrieve inventory data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="h-10 w-10 border-4 border-gray-100 border-t-black animate-spin rounded-full"></div>
        <p className="text-sm text-gray-500 animate-pulse">Synchronizing inventory data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center max-w-7xl mx-auto mt-4">
        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 text-3xl opacity-50">
           <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 uppercase tracking-tight">Database Failure</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm italic mb-6">{error}</p>
        <button 
            onClick={fetchInventory}
            className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
        >
            Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4 max-w-7xl mx-auto pb-10">
      {/* Header section matching Products page */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time oversight of all warehouse stock levels.</p>
        </div>
        <button 
          onClick={fetchInventory}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black rounded-xl text-sm font-semibold transition-all active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={<Package className="w-5 h-5" />} 
          title="Total SKU" 
          value={inventory.length} 
          color="gray"
        />
        <StatCard 
          icon={<AlertTriangle className="w-5 h-5" />} 
          title="Low Stock" 
          value={inventory.filter(p => (p.currentStock || 0) <= (p.reorderLevel || 0)).length} 
          color="amber"
          isWarning
        />
        <StatCard 
          icon={<Boxes className="w-5 h-5" />} 
          title="Out of Stock" 
          value={inventory.filter(p => (p.currentStock || 0) <= 0).length} 
          color="red"
          isDanger
        />
        <StatCard 
          icon={<CheckCircle className="w-5 h-5" />} 
          title="Optimal" 
          value={inventory.filter(p => (p.currentStock || 0) > (p.reorderLevel || 0)).length} 
          color="emerald"
        />
      </div>

      {/* Inventory Table matching ProductTable design */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold border-b border-gray-100">Product Info</th>
              <th className="p-4 font-semibold border-b border-gray-100">Category</th>
              <th className="p-4 font-semibold border-b border-gray-100 text-center">Available Units</th>
              <th className="p-4 font-semibold border-b border-gray-100 text-center">Reorder Point</th>
              <th className="p-4 font-semibold border-b border-gray-100 text-right">Inventory Health</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {inventory.map((p) => {
              const stock = p.currentStock || 0;
              const isLow = stock <= (p.reorderLevel || 0);
              const isOut = stock <= 0;

              return (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-black">
                      <div className="h-10 w-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-black leading-tight uppercase tracking-tight">{p.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{p.sku} | {p.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{p.category}</span>
                  </td>
                  <td className="p-4 text-center align-middle">
                    <span className={`text-xl font-bold font-mono ${isOut ? 'text-red-600' : isLow ? 'text-amber-500' : 'text-black'}`}>
                        {stock}
                    </span>
                  </td>
                  <td className="p-4 text-center align-middle">
                    <span className="text-xs text-gray-400 font-medium font-mono">
                      {p.reorderLevel || 0}
                    </span>
                  </td>
                  <td className="p-4 text-right align-middle">
                    {isOut ? (
                      <Badge type="danger" text="DEPLETED" />
                    ) : isLow ? (
                      <Badge type="warning" text="CRITICAL" />
                    ) : (
                      <Badge type="success" text="OPTIMAL" />
                    )}
                  </td>
                </tr>
              );
            })}

            {inventory.length === 0 && (
              <tr>
                <td colSpan={5} className="p-20 text-center bg-gray-50/10">
                  <p className="text-gray-400 font-medium uppercase tracking-[0.1em] text-xs italic">No warehouse assets identified in registry.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, isWarning, isDanger }) {
  return (
    <div className={`p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isDanger ? 'bg-red-50 text-red-500' : isWarning ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-400'} transition-colors`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 leading-none">{title}</p>
        <p className={`text-2xl font-bold tracking-tight mt-1.5 ${isDanger ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-black'} font-mono`}>{value}</p>
      </div>
    </div>
  );
}

function Badge({ type, text }) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${styles[type]}`}>
      {text}
    </span>
  );
}
