import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Search, Bell } from "lucide-react"; 
import NavbarItem from "./NavbarItem"; 

export default function Navbar() {
  return (
    // Main Container with fixed positioning and gradient background
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 md:px-10 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300 hover:bg-black/80">
      
      {/* LEFT SECTION: Logo and Navigation Links */}
      <div className="flex items-center gap-8">
        {/* Brand Logo */}
        <Link href="/" className="text-red-600 font-bold text-3xl uppercase tracking-tighter cursor-pointer">
          Netflix
        </Link>

        {/* Desktop Menu - Visible only on medium screens and up */}
        <div className="hidden md:flex gap-6 text-sm text-gray-300 font-medium">
          <NavbarItem label="Home" />
          <NavbarItem label="TV Shows" />
          <NavbarItem label="Movies" />
          <NavbarItem label="New & Popular" />
          <NavbarItem label="My List" />
        </div>
      </div>

      {/* RIGHT SECTION: User Actions & Authentication */}
      <div className="flex items-center gap-6 text-gray-300">
        <Search className="w-5 h-5 cursor-pointer hover:text-white transition" />
        <Bell className="w-5 h-5 cursor-pointer hover:text-white transition" />
        
        {/* AUTHENTICATION LOGIC */}
        <div className="flex items-center gap-4">
            {/* Case 1: User is Logged OUT - Show Sign In Button */}
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition font-medium text-sm">
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>

            {/* Case 2: User is Logged IN - Show User Avatar */}
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </div>
      </div>
    </nav>
  );
}