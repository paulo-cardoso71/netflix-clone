'use client';

import { Info, Play } from "lucide-react";
import { useSetAtom } from "jotai";
import { isModalOpenAtom, movieInModalAtom } from "@/store";
import { useRouter } from "next/navigation";
import { Movie, Tag, Actor, Episode } from '@prisma/client';
import Image from "next/image"; 

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
        description: "A giant rabbit...",
        thumbnailUrl: "https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg",
        videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: "10 min",
        genre: "Comedy",
        releaseYear: 2008,
        tags: [{ name: "Animation" }],
        actors: [],
        episodes: []
    };

    const movie = data || fallbackMovie;

    const handleOpenModal = () => {
        setMovie(movie as any); 
        setIsOpen(true);
    };

    // Detect if the video URL is a YouTube ID (simple check: no slashes or dots)
    const isYoutube = movie.videoUrl && !movie.videoUrl.includes('/') && !movie.videoUrl.includes('.');

    const handlePlayClick = () => {
        if (movie.episodes && movie.episodes.length > 0) {
            // Get the ID of the first episode
            const firstEpId = movie.episodes[0].id; 
            router.push(`/watch/${movie.id}?episodeId=${firstEpId}`);
        } else {
            router.push(`/watch/${movie.id}`);
        }
    };

    return (
        <div className="relative w-full h-[56.25vw] min-h-[50vh] md:min-h-[80vh] overflow-hidden bg-black">
            
            {/* 1. BACKGROUND IMAGE (Fallback behind everything) */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                 <Image 
                    src={movie.thumbnailUrl || ""}
                    alt={movie.title}
                    fill
                    className="object-cover brightness-[60%]"
                    priority
                 />
            </div>

            {/* 2. VIDEO LAYER (Covers the image) */}
            {isYoutube ? (
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    {/* YOUTUBE IFRAME: Scaled up to remove black bars, no opacity */}
                    <iframe
                        className="w-full h-[150%] -mt-[25%] lg:h-[130%] lg:-mt-[15%] object-cover scale-[1.5] brightness-[60%]"
                        src={`https://www.youtube.com/embed/${movie.videoUrl}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${movie.videoUrl}&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`}
                        title="Hero Background"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <video 
                    className="absolute top-0 left-0 h-full w-full object-cover brightness-[60%] z-0"
                    autoPlay 
                    muted 
                    loop 
                    poster={movie.thumbnailUrl || ""} 
                    src={movie.videoUrl || ""} 
                />
            )}

            {/* 3. GRADIENT (For text readability) */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent z-10 opacity-80" />
            <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10" />

            {/* 4. CONTENT */}
            <div className="absolute top-[20%] md:top-[40%] left-4 md:left-12 w-[90%] md:w-[40%] z-20">
                <h1 className="text-white text-3xl md:text-6xl font-bold drop-shadow-xl mb-2 md:mb-4 transition-transform duration-500">
                    {movie.title}
                </h1>

                <p className="text-white text-[10px] md:text-lg drop-shadow-md mb-4 md:mb-6 font-medium line-clamp-3 md:line-clamp-none text-shadow-md">
                    {movie.description}
                </p>

                <div className="flex flex-row items-center gap-3">
                    <button 
                        onClick={handlePlayClick}
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