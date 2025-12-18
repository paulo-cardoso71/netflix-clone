import Hero from "@/components/shared/Hero";
import MovieRow from "@/components/shared/MovieRow";
import InfoModal from "@/components/shared/InfoModal"; 
import Navbar from "@/components/shared/Navbar"; // Não esqueça a Navbar
import { prisma } from "@/lib/prisma"; // Usando a lib correta (Singleton)
import { currentUser } from "@clerk/nextjs/server"; 
import { Movie, Tag, Actor, Episode } from '@prisma/client';

// Interface para TypeScript não reclamar
interface MovieWithDetails extends Movie {
  tags: Tag[];
  actors: Actor[];
  episodes: Episode[];
}

export const revalidate = 0; // Garante dados frescos (Dynamic)

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

  // --- HERO LOGIC (Aleatório) ---
  const movieCount = await prisma.movie.count();
  const randomIndex = Math.floor(Math.random() * movieCount);
  const randomMovies = await prisma.movie.findMany({
    take: 1,
    skip: randomIndex,
    include: { tags: true, actors: true, episodes: true } 
  });
  // Se quiser forçar Wayne para testar, troque randomMovies[0] por um findFirst({ where: { title: 'Wayne' }})
  const heroMovie = randomMovies[0];

  // --- SEÇÕES DA HOME ---

  // 1. Filmes (Sem Episódios)
  const movies = await prisma.movie.findMany({
    where: {
      episodes: { none: {} }, // Apenas filmes
      OR: [ // Busca funciona aqui
        { title: { contains: query} }, 
        { description: { contains: query } },
        { tags: { some: { name: { contains: query } } } }
      ]
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { tags: true, actors: true, episodes: true }
  });

  // 2. Séries (Com Episódios) - SEPARAÇÃO PEDIDA
  const tvShows = await prisma.movie.findMany({
    where: {
      episodes: { some: {} }, // Apenas séries
      // Se tiver busca, filtra também
      OR: query ? [
        { title: { contains: query} }, 
        { description: { contains: query } }
      ] : undefined
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { tags: true, actors: true, episodes: true }
  });

  // 3. Categorias (Filtros manuais nos filmes carregados)
  // Nota: Para produção real, seria melhor fazer queries separadas no banco, mas assim funciona bem agora.
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

      {/* Só mostra o Hero se NÃO tiver busca digitada */}
      {!query && <Hero data={heroMovie} />}
      
      <div className={`pb-40 ${query ? 'pt-40' : 'pt-0'} space-y-8`}>
        
        {/* Se tiver busca, mostra resultados gerais. Se não, mostra seções organizadas */}
        {query ? (
             <MovieRow 
                title={`Results for "${query}"`} 
                movies={[...movies, ...tvShows]} // Junta filmes e séries na busca
                userFavorites={favoriteIds}
                userLikes={likedIds} 
            />
        ) : (
            <>
                {/* Minha Lista */}
                {myListMovies.length > 0 && (
                  <MovieRow 
                    title="My List" 
                    movies={myListMovies} 
                    userFavorites={favoriteIds}
                    userLikes={likedIds} 
                  />
                )}

                {/* Filmes Recentes */}
                <MovieRow 
                    title="Trending Movies" 
                    movies={movies} 
                    userFavorites={favoriteIds}
                    userLikes={likedIds} 
                />

                {/* Séries Recentes - AQUI ESTÁ SUA NOVA SEÇÃO */}
                {tvShows.length > 0 && (
                    <MovieRow 
                        title="TV Shows & Series" 
                        movies={tvShows} 
                        userFavorites={favoriteIds}
                        userLikes={likedIds} 
                    />
                )}

                {/* Categorias */}
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
        
        {/* Mensagem de "Não encontrado" */}
        {query && movies.length === 0 && tvShows.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                <p className="text-xl">Your search for &quot;{query}&quot; did not have any matches.</p>
            </div>
        )}
      </div>
    </main>
  );
}