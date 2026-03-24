import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProductsTabView from "@/components/products/ProductsTabView";

async function getProducts(token) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const res = await fetch(`${baseUrl}/products`, {
    cache: "no-store",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    console.error(`Failed to fetch products: ${res.status}`);
    return [];
  }

  return await res.json();
}

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <div className="flex items-center justify-center p-20">
        <p className="text-red-500">Error: Not Authenticated</p>
      </div>
    );
  }

  const token = session.accessToken;
  const products = await getProducts(token);

  return (
    <div className="max-w-7xl mx-auto">
      <ProductsTabView initialProducts={products} />
    </div>
  );
}
