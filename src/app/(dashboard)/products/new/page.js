"use client";

import ProductForm from "@/components/products/ProductForm";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-1">
          Create a new item in your warehouse catalog.
        </p>
      </div>

      <ProductForm 
        onCancel={() => router.push("/products")}
        onProductAdded={() => router.push("/products")}
      />
    </div>
  );
}
