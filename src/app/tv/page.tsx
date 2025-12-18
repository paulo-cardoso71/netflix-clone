import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import InfoModal from "@/components/shared/InfoModal"; 
import { prisma } from "@/lib/prisma"; // <--- USANDO A LIB CERTA AGORA
import { currentUser } from "@clerk/nextjs/server"; 

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

  // 1. Fetch a specific TV Show for the Hero
  // MUDANÇA AQUI: Trocamos 'Sintel' por 'Wayne'
  const heroMovie = await prisma.movie.findFirst({
    where: { title: 'Wayne' }, 
    include: { tags: true, actors: true, episodes: true }
  });

  // 2. Fetch ONLY TV Shows (Movies that have episodes)
  const tvShows = await prisma.movie.findMany({
    where: {
      episodes: { some: {} } // Pega tudo que tem pelo menos 1 episódio
    },
    orderBy: { createdAt: 'desc' },
    include: {
        tags: true,
        actors: true,
        episodes: true 
    }
  });

  // 3. Categories
  const actionShows = tvShows.filter(m => m.tags.some(t => t.name === 'Action'));
  const dramaShows = tvShows.filter(m => m.tags.some(t => t.name === 'Drama'));
  const animeShows = tvShows.filter(m => m.tags.some(t => t.name === 'Anime'));

  return (
    <main className="relative bg-zinc-900 min-h-screen pb-40">
      <InfoModal />

      {/* O Hero agora vai mostrar Wayne */}
      <Hero data={heroMovie} /> 
      
      <div className="pb-40 pt-0">
        
        <MovieRow 
            title="All TV Shows" 
            movies={tvShows} 
            userFavorites={favoriteIds}
            userLikes={likedIds}
        />

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
        
        {/* Se não tiver animes cadastrados com episódios, essa lista apenas não aparece */}
        {animeShows.length > 0 && (
            <MovieRow 
                title="Anime Series" 
                movies={animeShows} 
                userFavorites={favoriteIds}
                userLikes={likedIds}
            />
        )}
      </div>
    </main>
  );
}