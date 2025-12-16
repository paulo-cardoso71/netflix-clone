import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import InfoModal from "@/components/shared/InfoModal"; 
// 1. ADICIONEI AS IMPORTAÇÕES DE TAG, ACTOR E EPISODE
import { PrismaClient, Movie, Tag, Actor, Episode } from "@prisma/client"; 
import { currentUser } from "@clerk/nextjs/server"; 

const prisma = new PrismaClient();

// 2. DEFINI A INTERFACE IGUAL FIZEMOS NO MOVIEROW
interface MovieWithDetails extends Movie {
  tags: Tag[];
  actors: Actor[];
  episodes: Episode[];
}

export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  
  const params = await searchParams;
  const query = params.search || "";
  
  const user = await currentUser();
  
  // 3. CORRIGI A TIPAGEM DA VARIÁVEL: De 'Movie[]' para 'MovieWithDetails[]'
  let myListMovies: MovieWithDetails[] = [];
  let favoriteIds: string[] = [];
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
    
    // O TypeScript agora aceita isso pois a query inclui tudo
    myListMovies = listData.map((item) => item.movie) as MovieWithDetails[];
    favoriteIds = listData.map((item) => item.movieId);

    // 2. Fetch Likes Data
    const likesData = await prisma.like.findMany({
      where: { userId: user.id },
    });
    likedIds = likesData.map((item) => item.movieId);
  }

  // --- HERO LOGIC ---
  const heroMovie = await prisma.movie.findFirst({
    where: { 
        title: 'Big Buck Bunny' // Usando Elephants Dream que tem vídeo certo
    },
    include: { 
        tags: true, 
        actors: true, 
        episodes: true 
    } 
  });

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
      
      <InfoModal />

      {!query && <Hero data={heroMovie} />}
      
      <div className={`pb-40 ${query ? 'pt-40' : 'pt-0'}`}>
        
        <MovieRow 
            title={query ? `Results for "${query}"` : "Trending Now"} 
            movies={movies} 
            userFavorites={favoriteIds}
            userLikes={likedIds} 
        />
        
        {!query && myListMovies.length > 0 && (
          <MovieRow 
            title="My List" 
            movies={myListMovies} 
            userFavorites={favoriteIds}
            userLikes={likedIds} 
          />
        )}
        
        {!query && (
            <>
                <MovieRow 
                    title="Sci-Fi & Fantasy" 
                    movies={await prisma.movie.findMany({ where: { tags: { some: { name: 'Sci-Fi' } } }, include: { tags: true, actors: true, episodes: true } })} 
                    userFavorites={favoriteIds} 
                    userLikes={likedIds} 
                />
                <MovieRow 
                    title="Action Movies" 
                    movies={await prisma.movie.findMany({ where: { tags: { some: { name: 'Action' } } }, include: { tags: true, actors: true, episodes: true } })} 
                    userFavorites={favoriteIds} 
                    userLikes={likedIds} 
                />
            </>
        )}

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