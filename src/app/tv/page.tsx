import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import { PrismaClient, Movie } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server"; 

const prisma = new PrismaClient();

// Disable caching to ensure real-time updates (Optional, mostly for dev)
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

  // 1. Fetch ONLY TV Shows (Movies that have episodes)
  const tvShows = await prisma.movie.findMany({
    where: {
      episodes: { some: {} } // <--- THE FILTER MAGIC
    },
    orderBy: { createdAt: 'desc' },
    include: {
        tags: true,
        actors: true,
        episodes: true 
    }
  });

  // 2. We can categorize them by Genre for the rows
  const actionShows = tvShows.filter(m => m.tags.some(t => t.name === 'Action'));
  const dramaShows = tvShows.filter(m => m.tags.some(t => t.name === 'Drama'));

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      {/* We can reuse the generic Hero or create a specific one. Using generic for now. */}
      <Hero /> 
      
      <div className="pb-40 pt-0">
        
        {/* Main List */}
        <MovieRow 
            title="TV Shows" 
            movies={tvShows} 
            userFavorites={favoriteIds}
            userLikes={likedIds}
        />

        {/* Categories */}
        {actionShows.length > 0 && (
            <MovieRow 
                title="Action Series" 
                movies={actionShows} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}

        {dramaShows.length > 0 && (
            <MovieRow 
                title="Drama Series" 
                movies={dramaShows} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}
      </div>
    </main>
  );
}