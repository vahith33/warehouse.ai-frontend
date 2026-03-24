"use client";

import { Edit2, Trash2, Package } from "lucide-react";

export default function ProductTable({ products, onEdit, onDelete }) {
    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                <div className="h-16 w-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 text-3xl opacity-50">
                   <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">You haven't added any products to your inventory yet. Add a new product to get started.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4 font-semibold border-b border-gray-100">Product Info</th>
                        <th className="p-4 font-semibold border-b border-gray-100">Category</th>
                        <th className="p-4 font-semibold border-b border-gray-100 text-right">Price (₹)</th>
                        <th className="p-4 font-semibold border-b border-gray-100 text-right">Reorder Level</th>
                        <th className="p-4 font-semibold border-b border-gray-100 text-center">Status</th>
                        <th className="p-4 font-semibold border-b border-gray-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                    {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3 text-black">
                                    <div className="h-10 w-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                        {p.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-black">{p.name}</div>
                                        <div className="text-xs text-gray-500 font-mono mt-0.5">{p.sku} {p.brand && `• ${p.brand}`}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{p.category}</span>
                            </td>
                            <td className="p-4 text-right flex-col items-end">
                                <div className="font-semibold text-black font-mono">₹{p.sellingPrice?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</div>
                                <div className="text-xs text-gray-500">Cost: ₹{p.costPrice?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="text-black font-medium font-mono">
                                    {p.reorderLevel ? `${p.reorderLevel}` : `0`}
                                    <span className="text-gray-500 text-xs ml-1 uppercase">{p.unit}</span>
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                {p.isActive !== false ?
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                                    </span> :
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-100">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span> Inactive
                                    </span>
                                }
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onEdit && onEdit(p)}
                                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                        title="Edit Product"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onDelete && onDelete(p.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Product"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
