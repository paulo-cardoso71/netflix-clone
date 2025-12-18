import { prisma } from "@/lib/prisma"; // <--- MUDANÇA: Importando da lib
import { currentUser } from "@clerk/nextjs/server"; 
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import MovieCard from "@/components/shared/MovieCard";

// REMOVIDO: const prisma = new PrismaClient();

// Force dynamic rendering to ensure the list is always up-to-date
export const dynamic = 'force-dynamic';

export default async function MyListPage() {
  const user = await currentUser();

  if (!user) {
    return redirect("/"); // Redirect to home if not logged in
  }

  // 1. Fetch ONLY the movies present in the user's personal list
  const myListData = await prisma.myList.findMany({
    where: { userId: user.id },
    include: {
      movie: {
        include: {
            tags: true,
            actors: true,
            episodes: true
        }
      }
    },
    orderBy: { createdAt: 'desc' } // Newest additions first
  });

  // Extract the movie objects from the relation
  const movies = myListData.map((item) => item.movie);

  // Get IDs for UI feedback (Checkmark icon)
  const favoriteIds = myListData.map((item) => item.movieId);
  
  // Fetch Likes to ensure the ThumbsUp icon is correct
  const likesData = await prisma.like.findMany({ where: { userId: user.id } });
  const likedIds = likesData.map((item) => item.movieId);

  return (
    <main className="relative bg-zinc-900 min-h-screen w-full">
      <Navbar />
      
      <div className="pt-32 px-4 md:px-12 space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">My List</h1>
            
            {movies.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
                    <p className="text-xl">Your list is empty.</p>
                    <p className="text-sm">Add shows and movies that you want to watch later.</p>
                </div>
            ) : (
                // GRID LAYOUT: Responsive columns
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {movies.map((movie) => (
                        <MovieCard 
                            key={movie.id} 
                            data={movie} 
                            isFavorite={true} // Since it is on this page, it is definitely a favorite
                            isLiked={likedIds.includes(movie.id)}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    </main>
  );
}