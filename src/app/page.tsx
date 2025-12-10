import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import { PrismaClient, Movie } from "@prisma/client"; 
import { currentUser } from "@clerk/nextjs/server"; 

const prisma = new PrismaClient();

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  
  const params = await searchParams;
  const query = params.search || "";
  
  const user = await currentUser();
  
  let myListMovies: Movie[] = [];
  let favoriteIds: string[] = [];
  // NEW: Array to store IDs of liked movies
  let likedIds: string[] = [];

  if (user) {
    // 1. Fetch My List Data
    const listData = await prisma.myList.findMany({
      where: { userId: user.id },
      include: {
        movie: {
          include: {
            tags: true,
            actors: true,
            episodes: true
          }
        }
      }
    });
    
    myListMovies = listData.map((item) => item.movie);
    favoriteIds = listData.map((item) => item.movieId);

    // 2. NEW: Fetch Likes Data
    const likesData = await prisma.like.findMany({
      where: { userId: user.id },
    });
    likedIds = likesData.map((item) => item.movieId);
  }

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
        
        {/* Pass likedIds to all rows */}
        <MovieRow 
            title={query ? `Results for "${query}"` : "Trending Now"} 
            movies={movies} 
            userFavorites={favoriteIds}
            userLikes={likedIds} // <--- PASS HERE
        />
        
        {!query && myListMovies.length > 0 && (
          <MovieRow 
            title="My List" 
            movies={myListMovies} 
            userFavorites={favoriteIds}
            userLikes={likedIds} // <--- PASS HERE
          />
        )}
        
        {!query && <MovieRow title="New Releases" movies={movies} userFavorites={favoriteIds} userLikes={likedIds} />}

        {query && movies.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
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