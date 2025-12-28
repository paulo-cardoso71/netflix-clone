import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import InfoModal from "@/components/shared/InfoModal"; 
import { prisma } from "@/lib/prisma"; 
import { currentUser } from "@clerk/nextjs/server"; 
import { Movie, Tag, Actor, Episode } from '@prisma/client';

interface MovieWithDetails extends Movie {
  tags: Tag[];
  actors: Actor[];
  episodes: Episode[];
}

export const dynamic = 'force-dynamic';

export default async function TVPage() {
  const user = await currentUser();
  
  let favoriteIds: string[] = [];
  let likedIds: string[] = [];

  if (user) {
    const listData = await prisma.myList.findMany({ where: { userId: user.id } });
    favoriteIds = listData.map((item) => item.movieId);

    const likesData = await prisma.like.findMany({ where: { userId: user.id } });
    likedIds = likesData.map((item) => item.movieId);
  }

  // Fetch featured TV Show for Hero
  const heroMovie = await prisma.movie.findFirst({
    where: { title: 'Wayne' }, 
    include: { tags: true, actors: true, episodes: true }
  });

  // Fetch All TV Shows (Movies with episodes)
  const tvShows = await prisma.movie.findMany({
    where: {
      episodes: { some: {} } 
    },
    orderBy: { createdAt: 'desc' },
    include: {
        tags: true,
        actors: true,
        episodes: true 
    }
  });

  // Filter by Category
  const actionShows = tvShows.filter(m => m.tags.some(t => t.name === 'Action'));
  const dramaShows = tvShows.filter(m => m.tags.some(t => t.name === 'Drama'));
  const animeShows = tvShows.filter(m => m.tags.some(t => t.name === 'Anime'));

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      <InfoModal />

      <Hero data={heroMovie} /> 
      
      <div className="pb-40 pt-0 space-y-8">
        
        <MovieRow 
            title="All TV Shows" 
            movies={tvShows as MovieWithDetails[]} 
            userFavorites={favoriteIds}
            userLikes={likedIds}
        />

        {actionShows.length > 0 && (
            <MovieRow 
                title="Action Series" 
                movies={actionShows as MovieWithDetails[]} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}

        {dramaShows.length > 0 && (
            <MovieRow 
                title="Drama Series" 
                movies={dramaShows as MovieWithDetails[]} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}
        
        {animeShows.length > 0 && (
            <MovieRow 
                title="Anime Series" 
                movies={animeShows as MovieWithDetails[]} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}
      </div>
    </main>
  );
}