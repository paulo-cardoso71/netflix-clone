'use client'; 

import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link"; // <--- Import Link
import { Search, Bell } from "lucide-react"; 
import NavbarItem from "./NavbarItem"; 
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const currentSearch = searchParams.get("search");
    if (currentSearch) {
      const timer = setTimeout(() => {
         setShowSearch(true);
         setSearchQuery(currentSearch);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        router.push(`/?search=${searchQuery}`);
      } else if (!searchQuery && showSearch) {
        // If search is cleared, we stay on current page or go back? 
        // For now, let's keep it simple.
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, showSearch]);

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 md:px-10 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300 hover:bg-black/80">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-red-600 font-bold text-3xl uppercase tracking-tighter cursor-pointer">
          Netflix
        </Link>

        <div className="hidden md:flex gap-6 text-sm text-gray-300 font-medium">
          {/* UPDATED: Added Links to routes */}
          <Link href="/" className="hover:text-gray-300/80 transition">
             <NavbarItem label="Home" />
          </Link>
          
          <Link href="/tv" className="hover:text-gray-300/80 transition">
             <NavbarItem label="TV Shows" />
          </Link>
          
          <Link href="/movies" className="hover:text-gray-300/80 transition">
             <NavbarItem label="Movies" />
          </Link>
          
          {/* We can implement these later or redirect to Home for now */}
          <Link href="/new" className="hover:text-gray-300/80 transition">
             <NavbarItem label="New & Popular" />
          </Link>
          
          <Link href="/my-list" className="hover:text-gray-300/80 transition">
             <NavbarItem label="My List" />
          </Link>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6 text-gray-300">
        
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