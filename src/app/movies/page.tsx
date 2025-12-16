import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import InfoModal from "@/components/shared/InfoModal"; // <--- IMPORTANT: Modal needed here
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server"; 

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export default async function MoviesPage() {
  const user = await currentUser();
  
  let favoriteIds: string[] = [];
  let likedIds: string[] = [];

  if (user) {
    const listData = await prisma.myList.findMany({ where: { userId: user.id } });
    favoriteIds = listData.map((item) => item.movieId);

    const likesData = await prisma.like.findMany({ where: { userId: user.id } });
    likedIds = likesData.map((item) => item.movieId);
  }

  // 1. Fetch a specific Movie for the Hero (So 'More Info' works)
  const heroMovie = await prisma.movie.findFirst({
    where: { title: 'Elephants Dream' }, // You can pick any movie you want here
    include: { tags: true, actors: true, episodes: true }
  });

  // 2. Fetch ONLY Movies (No episodes)
  const movies = await prisma.movie.findMany({
    where: {
      episodes: { none: {} } 
    },
    orderBy: { createdAt: 'desc' },
    include: {
        tags: true,
        actors: true,
        episodes: true 
    }
  });

  // 3. Filter movies by Tag
  const comedyMovies = movies.filter(m => m.tags.some(t => t.name === 'Comedy'));
  const scifiMovies = movies.filter(m => m.tags.some(t => t.name === 'Sci-Fi'));
  const dramaMovies = movies.filter(m => m.tags.some(t => t.name === 'Drama'));
  const actionMovies = movies.filter(m => m.tags.some(t => t.name === 'Action'));

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      {/* The Modal must be present to listen to the open event */}
      <InfoModal />

      {/* Pass real data to Hero so 'More Info' has a real ID to work with */}
      <Hero data={heroMovie} /> 
      
      <div className="pb-40 pt-0">
        <MovieRow 
            title="All Movies" 
            movies={movies} 
            userFavorites={favoriteIds}
            userLikes={likedIds}
        />

        {comedyMovies.length > 0 && (
            <MovieRow 
                title="Comedy Hits" 
                movies={comedyMovies} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}

         {scifiMovies.length > 0 && (
            <MovieRow 
                title="Sci-Fi & Fantasy" 
                movies={scifiMovies} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}

        {actionMovies.length > 0 && (
            <MovieRow 
                title="Action" 
                movies={actionMovies} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}

        {dramaMovies.length > 0 && (
            <MovieRow 
                title="Drama" 
                movies={dramaMovies} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}
      </div>
    </main>
  );
}