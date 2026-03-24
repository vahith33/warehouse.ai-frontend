"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Settings, User, LogOut, Menu, Search } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Topbar({ onMenuClick = () => {} }) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const user = {
    name: session?.user?.name || "Admin",
    role: session?.user?.role || "Manager",
    email: session?.user?.email || "admin@warehouse.ai",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-gray-200 z-40">
      <div className="h-full flex items-center justify-between px-4 sm:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products, stock, SKU..."
            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-xl hover:bg-gray-100 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-800" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded-xl hover:bg-gray-100 transition"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-800" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-100 transition"
              aria-label="User menu"
            >
              <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>

              <div className="hidden sm:block text-left leading-tight">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.email}
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>

                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <div className="h-px bg-gray-100" />

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
