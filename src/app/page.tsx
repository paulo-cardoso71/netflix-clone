import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  
  const params = await searchParams;
  const query = params.search || "";

  const movies = await prisma.movie.findMany({
    where: {
      OR: [
        { title: { contains: query} }, 
        { description: { contains: query } },
        { tags: { some: { name: { contains: query } } } }
      ]
    },
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: {
        tags: true,
        actors: true,
        episodes: true 
    }
  });

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      {!query && <Hero />}
      
      <div className={`pb-40 ${query ? 'pt-40' : 'pt-0'}`}>
        
        {/* FIX: Escaped quotes below using &quot; */}
        <MovieRow 
            title={query ? `Results for "${query}"` : "Trending Now"} 
            movies={movies} 
        />
        
        {!query && <MovieRow title="New Releases" movies={movies} />}

        {query && movies.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                {/* FIX: Escaped quotes here: &quot;{query}&quot; */}
                <p className="text-xl">
                    Your search for &quot;{query}&quot; did not have any matches.
                </p>
                <p className="text-sm mt-2">Suggestions:</p>
                <ul className="text-sm list-disc mt-2 ml-4">
                    <li>Try different keywords</li>
                    <li>Looking for a movie or TV show?</li>
                    <li>Try using a movie title, actor name, or genre</li>
                </ul>
            </div>
        )}
      </div>
    </main>
  );
}