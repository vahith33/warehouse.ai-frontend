"use client";

import { useState } from "react";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import { deleteProduct } from "@/lib/api";

export default function ProductsTabView({ initialProducts }) {
    const [activeTab, setActiveTab] = useState("all");
    const [products, setProducts] = useState(initialProducts);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleProductAdded = (newProduct) => {
        setProducts((prev) => [...prev, newProduct]);
        setActiveTab("all");
    };

    const handleProductUpdated = (updatedProduct) => {
        setProducts((prev) => 
            prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
        setEditingProduct(null);
        setActiveTab("all");
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setActiveTab("edit");
    };

    const handleDeleteClick = async (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        
        try {
            await deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (err) {
            alert(err.message || "Failed to delete product");
        }
    };

    return (
        <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {activeTab === "all" ? "Inventory Items" : (activeTab === "edit" ? "Edit Product" : "Add New Product")}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {activeTab === "all" ? `Manage and track all ${products.length} products in your warehouse.` : "Modify the details below and save your changes."}
                    </p>
                </div>

                <div className="flex bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto self-start">
                    <button
                        onClick={() => {
                            setActiveTab("all");
                            setEditingProduct(null);
                        }}
                        className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "all" ? "bg-white shadow text-black" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setActiveTab("add");
                        }}
                        className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "add" ? "bg-white shadow text-black" : "text-gray-600 hover:text-gray-900 cursor-pointer"
                            }`}
                    >
                        +  Add Product
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === "all" && (
                    <ProductTable 
                        products={products} 
                        onEdit={handleEditClick} 
                        onDelete={handleDeleteClick} 
                    />
                )}
                
                {(activeTab === "add" || activeTab === "edit") && (
                    <ProductForm 
                        initialData={editingProduct}
                        onProductUpdated={editingProduct ? handleProductUpdated : handleProductAdded} 
                        onCancel={() => {
                            setActiveTab("all");
                            setEditingProduct(null);
                        }} 
                    />
                )}
            </div>
        </div>
    );
}
