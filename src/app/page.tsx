import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import InfoModal from "@/components/shared/InfoModal"; 
import Navbar from "@/components/shared/Navbar"; 
import { prisma } from "@/lib/prisma"; // Using the correct lib (Singleton)
import { currentUser } from "@clerk/nextjs/server"; 
import { Movie, Tag, Actor, Episode } from '@prisma/client';

// Type definition to satisfy TypeScript
interface MovieWithDetails extends Movie {
  tags: Tag[];
  actors: Actor[];
  episodes: Episode[];
}

export const revalidate = 0; // Ensure fresh data (Dynamic)

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const params = await searchParams;
  const query = params.search || "";
  const user = await currentUser();
  
  let myListMovies: MovieWithDetails[] = [];
  let favoriteIds: string[] = [];
  let likedIds: string[] = [];

  if (user) {
    // 1. Fetch My List & Likes
    const listData = await prisma.myList.findMany({
      where: { userId: user.id },
      include: {
        movie: { include: { tags: true, actors: true, episodes: true } }
      }
    });
    myListMovies = listData.map((item) => item.movie) as MovieWithDetails[];
    favoriteIds = listData.map((item) => item.movieId);

    const likesData = await prisma.like.findMany({ where: { userId: user.id } });
    likedIds = likesData.map((item) => item.movieId);
  }

  // --- HERO LOGIC ---
  const movieCount = await prisma.movie.count();
  const randomIndex = Math.floor(Math.random() * movieCount);
  const randomMovies = await prisma.movie.findMany({
    take: 1,
    skip: randomIndex,
    include: { tags: true, actors: true, episodes: true } 
  });
  // To force Wayne for testing, swap randomMovies[0] with findFirst({ where: { title: 'Wayne' }})
  const heroMovie = randomMovies[0];

  // --- HOME SECTIONS ---

  // 1. Movies (No Episodes)
  const movies = await prisma.movie.findMany({
    where: {
      episodes: { none: {} }, // Movies only
      OR: [ // Search logic works here
        { title: { contains: query} }, 
        { description: { contains: query } },
        { tags: { some: { name: { contains: query } } } }
      ]
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { tags: true, actors: true, episodes: true }
  });

  // 2. Series (With Episodes)
  const tvShows = await prisma.movie.findMany({
    where: {
      episodes: { some: {} }, // Series only
      // Apply search filter if query exists
      OR: query ? [
        { title: { contains: query} }, 
        { description: { contains: query } }
      ] : undefined
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { tags: true, actors: true, episodes: true }
  });

  // 3. Categories (Manual filtering on loaded movies)
  // Note: For real production, separate DB queries are better, but this works for now.
  const actionMovies = await prisma.movie.findMany({ 
      where: { tags: { some: { name: 'Action' } }, episodes: { none: {} } },
      take: 20,
      include: { tags: true, actors: true, episodes: true }
  });

  const scifiMovies = await prisma.movie.findMany({ 
    where: { tags: { some: { name: 'Sci-Fi' } }, episodes: { none: {} } },
    take: 20,
    include: { tags: true, actors: true, episodes: true }
  });

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      <Navbar />
      <InfoModal />

      {/* Only show Hero if NO search query */}
      {!query && <Hero data={heroMovie} />}
      
      <div className={`pb-40 ${query ? 'pt-40' : 'pt-0'} space-y-8`}>
        
        {/* If searching, show general results. Otherwise, show organized sections */}
        {query ? (
             <MovieRow 
                title={`Results for "${query}"`} 
                movies={[...movies, ...tvShows]} // Combine movies and series for search
                userFavorites={favoriteIds}
                userLikes={likedIds} 
            />
        ) : (
            <>
                {/* My List */}
                {myListMovies.length > 0 && (
                  <MovieRow 
                    title="My List" 
                    movies={myListMovies} 
                    userFavorites={favoriteIds}
                    userLikes={likedIds} 
                  />
                )}

                {/* Trending Movies */}
                <MovieRow 
                    title="Trending Movies" 
                    movies={movies} 
                    userFavorites={favoriteIds}
                    userLikes={likedIds} 
                />

                {/* Trending Series - New Section */}
                {tvShows.length > 0 && (
                    <MovieRow 
                        title="TV Shows & Series" 
                        movies={tvShows} 
                        userFavorites={favoriteIds}
                        userLikes={likedIds} 
                    />
                )}

                {/* Categories */}
                <MovieRow 
                    title="Sci-Fi & Fantasy" 
                    movies={scifiMovies} 
                    userFavorites={favoriteIds} 
                    userLikes={likedIds} 
                />
                
                <MovieRow 
                    title="Action Movies" 
                    movies={actionMovies} 
                    userFavorites={favoriteIds} 
                    userLikes={likedIds} 
                />
            </>
        )}
        
        {/* "Not Found" Message */}
        {query && movies.length === 0 && tvShows.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                <p className="text-xl">Your search for &quot;{query}&quot; did not have any matches.</p>
            </div>
        )}
      </div>
    </main>
  );
}