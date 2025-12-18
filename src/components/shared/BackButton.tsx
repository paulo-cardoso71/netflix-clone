'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <div onClick={() => router.back()} className="cursor-pointer">
      <ArrowLeft 
        className="text-white hover:text-neutral-300 transition" 
        size={40} 
      />
    </div>
  );
}