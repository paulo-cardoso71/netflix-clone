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
  // Await params and searchParams (Required for Next.js 15)
  const params = await props.params; 
  const searchParams = await props.searchParams;
  const { movieId } = params;
  const { episodeId } = searchParams;

  // 1. Fetch the main movie or series details from the database
  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
  });

  // 2. Redirect to home if content doesn't exist
  if (!movie) {
    redirect('/');
  }

  // Initialize playback state (Defaults to the main movie file or trailer)
  let videoIdToPlay = movie.videoUrl; 
  let titleToShow = movie.title;

  // 3. Episode Logic: Check if a specific episode ID is in the URL
  if (episodeId) {
    const episode = await prisma.episode.findUnique({
        where: { id: episodeId }
    });
    
    // If the episode is found, override the video source and title
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
          <span className="font-light">Watching:</span> {titleToShow} {/* Note: Using titleToShow here is correct */}
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