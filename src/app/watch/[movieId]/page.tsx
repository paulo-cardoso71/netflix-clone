    import React from 'react';
    import { prisma } from '@/lib/prisma'; 
    import { redirect } from 'next/navigation';
    import Link from 'next/link';
    import { ArrowLeft } from 'lucide-react';
    import BackButton from '@/components/shared/BackButton';

    interface WatchPageProps {
    params: Promise<{ 
        movieId: string;
    }>;
    searchParams: Promise<{ episodeId?: string }>;
    }

    export default async function WatchPage(props: WatchPageProps) {
    // <--- MUDANÇA 2: Desembrulhamos a promessa antes de usar
    const params = await props.params; 
    const searchParams = await props.searchParams;
    const { movieId } = params;
    const { episodeId } = searchParams;

    // 1. Fetch movie from database using URL ID
    const movie = await prisma.movie.findUnique({
        where: {
        id: movieId, // Agora movieId tem o valor correto (ex: "3d0ca6...")
        },
    });

    // 2. If movie is not found, redirect to home
    if (!movie) {
        redirect('/');
    }

    let videoIdToPlay = movie.videoUrl; // Começa assumindo que é o filme/trailer
    let titleToShow = movie.title;

    // SE veio um episodeId na URL, buscamos o episódio no banco
    if (episodeId) {
        const episode = await prisma.episode.findUnique({
            where: { id: episodeId }
        });
        
        // Se achou o episódio, Substitui o vídeo e o título
        if (episode) {
            videoIdToPlay = episode.videoUrl; 
            titleToShow = `${movie.title}: ${episode.title}`; 
        }
    }

    return (
        <div className="h-screen w-screen bg-black">
        <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70">
           <BackButton />
            <p className="text-white text-xl md:text-3xl font-bold">
            <span className="font-light">Watching:</span> {movie.title}
            </p>
        </nav>

        <div className="h-full w-full">
            <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoIdToPlay}?autoplay=1&rel=0&modestbranding=1`}
            title={movie.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            ></iframe>
        </div>
        </div>
    );
    }