'use client';

import { Info, Play } from "lucide-react";
import { useSetAtom } from "jotai";
import { isModalOpenAtom, movieInModalAtom } from "@/store";
import { useRouter } from "next/navigation";
import { Movie, Tag, Actor, Episode } from '@prisma/client';

interface MovieWithDetails extends Movie {
    tags: Tag[];
    actors: Actor[];
    episodes: Episode[];
}

interface HeroProps {
    data?: MovieWithDetails | null;
}

export default function Hero({ data }: HeroProps) {
  const router = useRouter();
  
  const setIsOpen = useSetAtom(isModalOpenAtom);
  const setMovie = useSetAtom(movieInModalAtom);

  const fallbackMovie = {
    id: "hero-bunny",
    title: "Big Buck Bunny",
    description: "A giant rabbit with a heart bigger than himself. Watch as he seeks revenge on the bullying rodents in this open-source classic.",
    thumbnailUrl: "https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "10 min",
    genre: "Comedy",
    releaseYear: 2008,
    tags: [{ name: "Animation" }, { name: "Comedy" }],
    actors: [],
    episodes: []
  };

  const movie = data || fallbackMovie;

  const handleOpenModal = () => {
    setMovie(movie as any); 
    setIsOpen(true);
  };

  return (
    // AJUSTE MOBILE 1: Altura dinâmica (menor no celular, grande no PC)
    <div className="relative w-full h-[56.25vw] min-h-[50vh] md:min-h-[80vh]">
      
      <video 
        className="absolute top-0 left-0 h-full w-full object-cover brightness-[60%]"
        autoPlay 
        muted 
        loop 
        poster={movie.thumbnailUrl} 
        src={movie.videoUrl || ""} // <--- A CORREÇÃO MÁGICA ESTÁ AQUI (Agora é dinâmico)
      />

      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

      {/* AJUSTE MOBILE 2: Subimos o texto no celular (top-20%) para não bater nos filmes abaixo */}
      <div className="absolute top-[20%] md:top-[40%] left-4 md:left-12 w-[90%] md:w-[40%] z-10">
        
        {/* AJUSTE MOBILE 3: Texto menor no celular (text-3xl) */}
        <h1 className="text-white text-3xl md:text-6xl font-bold drop-shadow-xl mb-2 md:mb-4 transition-transform duration-500">
          {movie.title}
        </h1>

        {/* AJUSTE MOBILE 4: Limita o texto a 3 linhas no celular para não poluir */}
        <p className="text-white text-[10px] md:text-lg drop-shadow-md mb-4 md:mb-6 font-medium line-clamp-3 md:line-clamp-none">
          {movie.description}
        </p>

        <div className="flex flex-row items-center gap-3">
          <button 
            onClick={() => router.push(`/watch/${movie.id}`)}
            className="bg-white text-black text-sm md:text-xl font-bold px-4 py-2 md:px-8 md:py-3 rounded hover:bg-white/80 transition flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 md:w-6 md:h-6 fill-black" />
            Play
          </button>
          
          <button 
            onClick={handleOpenModal} 
            className="bg-gray-500/70 text-white text-sm md:text-xl font-bold px-4 py-2 md:px-8 md:py-3 rounded hover:bg-gray-500/50 transition flex items-center gap-2 cursor-pointer backdrop-blur-sm"
          >
            <Info className="w-4 h-4 md:w-6 md:h-6" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}