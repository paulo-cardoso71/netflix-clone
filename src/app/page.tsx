import Hero from "@/components/shared/Hero";

export default function Home() {
  return (
    // The main tag serves as the page wrapper
    <main className="relative bg-zinc-900 min-h-screen">
      {/* Navbar is injected automatically by layout.tsx - Do not import it here */}
      
      <Hero />
      
      {/* Movie Rows Placeholder - Waiting for Wireframes implementation */}
      <div className="px-4 md:px-10 py-10">
        <h2 className="text-white text-xl md:text-2xl font-bold mb-4">
            Trending Now (Placeholder)
        </h2>
        
        {/* Skeleton Loading State for visual feedback */}
        <div className="h-40 bg-zinc-800 rounded animate-pulse w-full"></div>
      </div>
    </main>
  );
}