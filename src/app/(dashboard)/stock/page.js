"use client";

import { useEffect, useMemo, useState } from "react";
import { getProducts, getStockMovements, getInventoryStatus, createStockMovement } from "@/lib/api";

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("IN"); // IN / OUT
  const [note, setNote] = useState("");

  const [movements, setMovements] = useState([]);
  const [currentStock, setCurrentStock] = useState(null);
  
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStock, setLoadingStock] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId);
  }, [products, selectedProductId]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchStockData = async (productId) => {
    if (!productId) return;
    try {
      setLoadingStock(true);
      // BACKEND API CALLS ONLY (Per user request)
      const [movementsData, stockData] = await Promise.all([
        getStockMovements(productId),
        getInventoryStatus(productId),
      ]);
      setMovements(movementsData);
      setCurrentStock(stockData);
    } catch (err) {
      console.error("Backend fetch error:", err);
      setMovements([]);
      setCurrentStock(null);
    } finally {
      setLoadingStock(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchStockData(selectedProductId);
    } else {
      setMovements([]);
      setCurrentStock(null);
    }
  }, [selectedProductId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      alert("Please select a product");
      return;
    }

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        productId: selectedProductId,
        quantity: qty,
        type: type, 
        referenceType: type === "IN" ? "PURCHASE" : "SALE",
        note: note || null,
      };

      await createStockMovement(payload);
      
      setQuantity("");
      setNote("");
      
      // Refresh purely from Backend APIs
      await fetchStockData(selectedProductId);
      alert("Stock movement recorded successfully ✅");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save stock movement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <p className="text-gray-600 mt-1">
          Record stock IN / OUT and track stock history using Backend APIs.
        </p>
      </div>

      {/* Select Product */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-black">Select Product</h2>

        <div className="mt-4">
          {loadingProducts ? (
            <p className="text-gray-500">Loading products...</p>
          ) : (
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full border border-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black appearance-none"
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Current Stock - DATA FROM BACKEND */}
        {selectedProduct && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoCard title="Backend Current Stock" value={currentStock?.currentStock ?? 0} unit={selectedProduct.unit} />
            <InfoCard title="Backend Total IN" value={currentStock?.totalIn ?? 0} unit={selectedProduct.unit} />
            <InfoCard title="Backend Total OUT" value={currentStock?.totalOut ?? 0} unit={selectedProduct.unit} />
          </div>
        )}
      </div>

      {/* Stock Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-900">Record Stock Movement</h2>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black appearance-none"
            >
              <option value="IN">Stock IN</option>
              <option value="OUT">Stock OUT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              placeholder="Enter quantity"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black appearance-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              type="text"
              placeholder="Example: initial stock, inventory count..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <button
            disabled={submitting || !selectedProductId}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {submitting ? "Processing..." : "Save Stock Movement"}
          </button>
        </form>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Stock History</h2>
          <p className="text-sm text-gray-500 mt-1">Movement records retrieved from the server.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Details</th>
                <th className="p-4">Note</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {!selectedProductId ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Please select a product.</td>
                </tr>
              ) : loadingStock ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Loading backend data...</td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No records found.</td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${m.type === "IN" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {m.type}
                        </span>
                    </td>
                    <td className="p-4 font-bold text-gray-900">{m.quantity}</td>
                    <td className="p-4 text-gray-600">{m.referenceType || "MANUAL"}</td>
                    <td className="p-4 text-gray-600 text-xs">{m.note || "-"}</td>
                    <td className="p-4 text-gray-400 font-mono text-[10px]">{m.createdAt ? new Date(m.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, unit }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 uppercase">{unit}</p>
      </div>
    </div>
  );
}
