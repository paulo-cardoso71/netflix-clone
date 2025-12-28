'use client'; 

import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link"; 
import { Search, Bell, ChevronDown } from "lucide-react"; 
import NavbarItem from "./NavbarItem"; 
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; 
import MobileMenu from "./MobileMenu"; 

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mobile Menu State
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Auto-close mobile menu on window resize (Desktop view)
  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth >= 768) {
              setShowMobileMenu(false);
          }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle Mobile Menu
  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  // Sync internal state with URL search params
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

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        router.push(`/?search=${searchQuery}`);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router]);

  // Hide Navbar on Watch page
  if (pathname?.startsWith('/watch')) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-40 flex items-center justify-between px-4 py-4 md:px-10 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300 hover:bg-black/80">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-red-600 font-bold text-3xl uppercase tracking-tighter cursor-pointer">
          Netflix
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-sm text-gray-300 font-medium">
          <Link href="/" className="hover:text-gray-300/80 transition"><NavbarItem label="Home" /></Link>
          <Link href="/tv" className="hover:text-gray-300/80 transition"><NavbarItem label="TV Shows" /></Link>
          <Link href="/movies" className="hover:text-gray-300/80 transition"><NavbarItem label="Movies" /></Link>
          <Link href="/new" className="hover:text-gray-300/80 transition"><NavbarItem label="New & Popular" /></Link>
          <Link href="/my-list" className="hover:text-gray-300/80 transition"><NavbarItem label="My List" /></Link>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div 
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-row items-center gap-2 cursor-pointer relative"
        >
            <p className="text-white text-sm">Browse</p>
            <ChevronDown className={`text-white w-4 transition ${showMobileMenu ? 'rotate-180' : 'rotate-0'}`} />
            
            <MobileMenu visible={showMobileMenu} />
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