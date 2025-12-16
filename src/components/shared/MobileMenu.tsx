import React from 'react';
import Link from "next/link";

interface MobileMenuProps {
  visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    // CORREÇÃO AQUI: Fundo sólido, bordas arredondadas, sombra e z-index alto
    <div className="bg-zinc-900 w-48 absolute top-10 left-0 py-4 flex-col border border-zinc-800 rounded-md flex z-50 shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
      <div className="flex flex-col gap-3">
        
        <Link href="/" className="px-3 text-center text-white text-sm hover:underline">
            Home
        </Link>
        
        <Link href="/tv" className="px-3 text-center text-white text-sm hover:underline">
            TV Shows
        </Link>
        
        <Link href="/movies" className="px-3 text-center text-white text-sm hover:underline">
            Movies
        </Link>
        
        <Link href="/new" className="px-3 text-center text-white text-sm hover:underline">
            New & Popular
        </Link>
        
        <Link href="/my-list" className="px-3 text-center text-white text-sm hover:underline">
            My List
        </Link>

      </div>
    </div>
  );
};

export default MobileMenu;