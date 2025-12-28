import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import InfoModal from "@/components/shared/InfoModal"; 
import { prisma } from "@/lib/prisma"; 
import { currentUser } from "@clerk/nextjs/server"; 

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

  // Fetch a specific Movie for the Hero
  const heroMovie = await prisma.movie.findFirst({
    where: { title: 'Elephants Dream' }, 
    include: { tags: true, actors: true, episodes: true }
  });

  // Fetch ONLY Movies (No episodes)
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

  // Filter movies by Tag
  const comedyMovies = movies.filter(m => m.tags.some(t => t.name === 'Comedy'));
  const scifiMovies = movies.filter(m => m.tags.some(t => t.name === 'Sci-Fi'));
  const dramaMovies = movies.filter(m => m.tags.some(t => t.name === 'Drama'));
  const actionMovies = movies.filter(m => m.tags.some(t => t.name === 'Action'));

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      <InfoModal />

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