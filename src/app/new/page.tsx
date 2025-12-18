import { prisma } from "@/lib/prisma"; // <--- MUDANÇA: Importando da lib
import { currentUser } from "@clerk/nextjs/server"; 
import Navbar from "@/components/shared/Navbar";
import MovieCard from "@/components/shared/MovieCard";

// REMOVIDO: const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function NewAndPopularPage() {
  const user = await currentUser();
  
  let favoriteIds: string[] = [];
  let likedIds: string[] = [];

  if (user) {
    const listData = await prisma.myList.findMany({ where: { userId: user.id } });
    favoriteIds = listData.map((item) => item.movieId);

    const likesData = await prisma.like.findMany({ where: { userId: user.id } });
    likedIds = likesData.map((item) => item.movieId);
  }

  // Busca filmes ordenados pelo ano de lançamento (descendente)
  const movies = await prisma.movie.findMany({
    take: 20, // Pega os 20 mais recentes
    orderBy: [
        { releaseYear: 'desc' },
        { createdAt: 'desc' }
    ],
    include: {
        tags: true,
        actors: true,
        episodes: true 
    }
  });

  return (
    <main className="relative bg-zinc-900 min-h-screen w-full">
      <Navbar />
      
      <div className="pt-32 px-4 md:px-12 space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">New & Popular</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <MovieCard 
                        key={movie.id} 
                        data={movie} 
                        isFavorite={favoriteIds.includes(movie.id)}
                        isLiked={likedIds.includes(movie.id)}
                    />
                ))}
            </div>
        </div>
      </div>
    </main>
  );
}