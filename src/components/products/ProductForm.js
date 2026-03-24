"use client";

import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProductForm({ initialData, onProductUpdated, onCancel }) {
    const router = useRouter();
    const isEdit = !!initialData;

    const [formData, setFormData] = useState({
        sku: "",
        name: "",
        category: "",
        brand: "",
        unit: "",
        barcode: "",
        costPrice: "",
        sellingPrice: "",
        reorderLevel: "0",
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Populate form if we are editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                sku: initialData.sku || "",
                name: initialData.name || "",
                category: initialData.category || "",
                brand: initialData.brand || "",
                unit: initialData.unit || "",
                barcode: initialData.barcode || "",
                costPrice: initialData.costPrice?.toString() || "",
                sellingPrice: initialData.sellingPrice?.toString() || "",
                reorderLevel: initialData.reorderLevel?.toString() || "0",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Data sanitization
            const payload = { 
                ...formData,
                costPrice: parseFloat(formData.costPrice) || 0,
                sellingPrice: parseFloat(formData.sellingPrice) || 0,
                reorderLevel: parseInt(formData.reorderLevel, 10) || 0,
            };

            // Remove empty optional fields
            if (!payload.brand) delete payload.brand;
            if (!payload.barcode) delete payload.barcode;

            let result;
            if (isEdit) {
                result = await updateProduct(initialData.id, payload);
            } else {
                result = await createProduct(payload);
            }

            if (onProductUpdated) {
                onProductUpdated(result);
            } else {
                // Default behavior (like on /products/new page)
                router.push("/products");
                router.refresh();
            }

            if (!isEdit) {
                // Reset form on success if it's a new product
                setFormData({
                    sku: "", name: "", category: "", brand: "", unit: "",
                    barcode: "", costPrice: "", sellingPrice: "", reorderLevel: "0"
                });
            }
            
        } catch (err) {
            setError(err.message || "Something went wrong. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-black mb-6">
                {isEdit ? `Edit Product: ${initialData.name}` : "Add New Product"}
            </h2>

            {error && (
                <div className="mb-6 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl text-sm font-medium animate-in fade-in zoom-in duration-300">
                    ⚠️ {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">SKU *</label>
                    <input type="text" name="sku" required value={formData.sku} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="e.g. PRD-001" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">Product Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="e.g. Wireless Mouse" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">Category *</label>
                    <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="e.g. Electronics" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="e.g. Logitech" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">Unit *</label>
                    <input type="text" name="unit" required value={formData.unit} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="e.g. pcs, kg" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">Barcode</label>
                    <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="Scan or enter barcode" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">Cost Price *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">₹</span>
                        <input type="number" step="0.01" name="costPrice" required value={formData.costPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 pl-8 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="0.00" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">Selling Price *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">₹</span>
                        <input type="number" step="0.01" name="sellingPrice" required value={formData.sellingPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 pl-8 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="0.00" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">Reorder Level *</label>
                    <input type="number" name="reorderLevel" required value={formData.reorderLevel} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black transition-all text-black" placeholder="e.g. 10" />
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                    <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-700 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200 transition-all">
                        {isEdit ? "Cancel" : "Clear"}
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-black text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                        {loading ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update Product" : "Save Product")}
                    </button>
                </div>
            </form>
        </div>
    );
}
