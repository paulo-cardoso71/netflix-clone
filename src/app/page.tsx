import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client (Best practice: move this to a singleton lib file later)
const prisma = new PrismaClient();

export default async function Home() {
  // Fetch movies from the database directly on the server
  // This runs on the server before sending HTML to the browser
  const movies = await prisma.movie.findMany({
    take: 4, // Limit to 4 for now just to test the grid
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      {/* Navbar is in layout.tsx */}
      <Hero />
      
      <div className="pb-40">
        {/* Render the list of movies fetched from DB */}
        <MovieRow title="Trending Now" movies={movies} />
        
        {/* Placeholder for a second row */}
        <MovieRow title="New Releases" movies={movies} />
      </div>
    </main>
  );
}