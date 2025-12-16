import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/shared/Navbar' // Import your Navbar component
import InfoModal from '@/components/shared/InfoModal';
import { Suspense } from "react";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Netflix Clone',
  description: 'Project Tier 3 - Mentoria',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
         <Suspense fallback={null}>
            <Navbar /> 
          </Suspense>
          
          {/* Add the Modal here. It is hidden by default controlled by Jotai */}
          <InfoModal /> 
          
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}