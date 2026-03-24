"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Warehouse,
  LayoutDashboard,
  Package,
  Boxes,
  TrendingUp,
  LogOut,
  ChevronRight,
  X,
  Bot,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Products",
    icon: Package,
    href: "/products",
    subItems: [
      { label: "All Products", href: "/products" },
      { label: "Add Product", href: "/products/new" },
    ],
  },
  {
    label: "Stock Management",
    icon: Boxes,
    href: "/stock",
  },
  {
    label: "Inventory",
    icon: TrendingUp,
    href: "/inventory",
  },
    {
    label: "AI Chat",
    icon: Bot,
    href: "/ai-chat",
  },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  // Expand the menu automatically if user is inside that section
  const defaultExpanded = useMemo(() => {
    return {
      Products: pathname.startsWith("/products"),
    };
  }, [pathname]);

  const [expandedItems, setExpandedItems] = useState(defaultExpanded);

  useEffect(() => {
    setExpandedItems((prev) => ({
      ...prev,
      ...defaultExpanded,
    }));
  }, [defaultExpanded]);

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleNavClick = () => {
    // close sidebar on mobile after clicking any link
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 z-40 md:z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2 bg-black rounded-lg shadow-sm">
              <Warehouse className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">Warehouse Management</h1>
              <p className="text-xs text-gray-500">Using AI</p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems?.length > 0;
              const expanded = expandedItems[item.label];

              return (
                <div key={item.label}>
                  {/* Main item */}
                  <div className="flex items-center gap-2">
                    {hasSubItems ? (
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.label)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition
                        ${
                          isActive(item.href)
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            expanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition
                        ${
                          isActive(item.href)
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Sub items */}
                  {hasSubItems && expanded && (
                    <div className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-3">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={handleNavClick}
                          className={`block px-3 py-2 rounded-lg text-sm transition
                          ${
                            isActive(sub.href)
                              ? "text-black bg-gray-100 font-medium"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
