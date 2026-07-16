import React, { useState } from "react";
import { FiSearch, FiSun, FiMoon, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { HiOutlineCodeBracketSquare } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode, search, setSearch }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <HiOutlineCodeBracketSquare className="h-6 w-6 text-emerald-500" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            ProjectShare
          </span>
        </div>

        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="flex h-7 w-14 items-center rounded-full bg-gray-800 px-1 transition-colors dark:bg-gray-700"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
                darkMode ? "translate-x-7" : "translate-x-0"
              }`}
            >
              {darkMode ? (
                <FiMoon className="h-3 w-3 text-gray-700" />
              ) : (
                <FiSun className="h-3 w-3 text-amber-500" />
              )}
            </span>
          </button>

          <nav className="hidden items-center gap-6 sm:flex">
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              My Projects
            </a>
          </nav>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                <FiUser className="h-4 w-4" />
              </span>
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:block">
                {user?.name || "Account"}
              </span>
              <FiChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-400 dark:border-gray-700">
                  {user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
