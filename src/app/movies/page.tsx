import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import { PrismaClient, Movie } from "@prisma/client";
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

  // 1. Fetch ONLY Movies (No episodes)
  const movies = await prisma.movie.findMany({
    where: {
      episodes: { none: {} } // <--- THE FILTER MAGIC
    },
    orderBy: { createdAt: 'desc' },
    include: {
        tags: true,
        actors: true,
        episodes: true 
    }
  });

  const comedyMovies = movies.filter(m => m.tags.some(t => t.name === 'Comedy'));
  const scifiMovies = movies.filter(m => m.tags.some(t => t.name === 'Sci-Fi'));

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      <Hero /> 
      
      <div className="pb-40 pt-0">
        <MovieRow 
            title="Movies" 
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
      </div>
    </main>
  );
}