import { getSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Helper to fetch with the NextAuth session token automatically.
 */
async function fetchWithAuth(endpoint, options = {}) {
  const session = await getSession();
  const token = session?.accessToken;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // In a real app, you might trigger a logout or token refresh
    throw new Error("Unauthorized. Please log in again.");
  }

  return response;
}

// AI CHAT
export async function chatWithAI(message) {
  const response = await fetchWithAuth("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to get AI response");
  }

  const data = await response.json();
  return data.answer;
}

// PRODUCTS
export async function getProducts() {
  const response = await fetchWithAuth("/products");
  if (!response.ok) throw new Error("Failed to fetch products");
  return await response.json();
}

export async function getProduct(id) {
  const response = await fetchWithAuth(`/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product details");
  return await response.json();
}

export async function createProduct(productData) {
  const response = await fetchWithAuth("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create product");
  }
  return await response.json();
}

export async function updateProduct(id, productData) {
  const response = await fetchWithAuth(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update product");
  }
  return await response.json();
}

export async function deleteProduct(id) {
  const response = await fetchWithAuth(`/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return await response.json();
}

// STOCK MOVEMENTS
export async function getStockMovements(productId = null) {
  const url = productId ? `/stock-movements?productId=${productId}` : "/stock-movements";
  const response = await fetchWithAuth(url);
  if (!response.ok) throw new Error("Failed to fetch stock movements");
  return await response.json();
}

export async function createStockMovement(movementData) {
  const response = await fetchWithAuth("/stock-movements", {
    method: "POST",
    body: JSON.stringify(movementData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to record stock movement");
  }
  return await response.json();
}

// INVENTORY
export async function getInventoryStatus(productId) {
  const response = await fetchWithAuth(`/inventory/current-stock?productId=${productId}`);
  if (!response.ok) throw new Error("Failed to fetch inventory status");
  return await response.json();
}

export async function getAllInventory() {
  const response = await fetchWithAuth("/inventory/all");
  if (!response.ok) throw new Error("Failed to fetch all inventory");
  return await response.json();
}
