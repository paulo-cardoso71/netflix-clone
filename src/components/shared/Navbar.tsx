'use client'; 

import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Search, Bell } from "lucide-react"; 
import NavbarItem from "./NavbarItem"; 
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Effect: Hydrate the search input if the user refreshes the page with a query in the URL
  useEffect(() => {
    const currentSearch = searchParams.get("search");
    if (currentSearch) {
      setShowSearch(true);
      setSearchQuery(currentSearch);
    }
  }, [searchParams]);

  // Debounce Logic: Wait 500ms after user stops typing to update the URL
  // This prevents the application from spamming the server/database on every keystroke
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // If there is a query, push to the search route
      if (searchQuery) {
        router.push(`/?search=${searchQuery}`);
      } 
      // If input is cleared and search bar is open, return to clean home
      else if (!searchQuery && showSearch) {
        router.push('/');
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, showSearch]);

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 md:px-10 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300 hover:bg-black/80">
      
      {/* LEFT SECTION: Brand Logo and Main Navigation */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-red-600 font-bold text-3xl uppercase tracking-tighter cursor-pointer">
          Netflix
        </Link>

        <div className="hidden md:flex gap-6 text-sm text-gray-300 font-medium">
          <NavbarItem label="Home" />
          <NavbarItem label="TV Shows" />
          <NavbarItem label="Movies" />
          <NavbarItem label="New & Popular" />
          <NavbarItem label="My List" />
        </div>
      </div>

      {/* RIGHT SECTION: Search Bar, Notifications, and Authentication */}
      <div className="flex items-center gap-6 text-gray-300">
        
        {/* EXPANDABLE SEARCH BAR */}
        <div className={`flex items-center border transition-all duration-300 ${showSearch ? 'border-white bg-black/50 px-2' : 'border-transparent'}`}>
            <Search 
                onClick={() => setShowSearch(!showSearch)} 
                className="w-5 h-5 cursor-pointer hover:text-white transition" 
            />
            <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres"
                className={`
                    bg-transparent text-white text-sm outline-none transition-all duration-300 ml-2
                    ${showSearch ? 'w-48 opacity-100' : 'w-0 opacity-0'}
                `}
            />
        </div>

        <Bell className="w-5 h-5 cursor-pointer hover:text-white transition" />
        
        <div className="flex items-center gap-4">
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition font-medium text-sm">
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </div>
      </div>
    </nav>
  );
}