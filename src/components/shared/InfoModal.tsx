'use client'; 

import React, { useCallback, useEffect, useState } from 'react';
import { X, Play, Plus, Volume2, VolumeX, Share2, Check } from 'lucide-react'; // Added Share2 and Check icons
import { useAtom } from 'jotai';
import { isModalOpenAtom, movieInModalAtom } from '@/store'; 
import Image from 'next/image';
import { Movie, Episode } from '@prisma/client';

interface MovieWithDetails extends Movie {
  episodes?: Episode[];
}

const InfoModal = () => {
  const [isOpen, setIsOpen] = useAtom(isModalOpenAtom);
  const [movie, setMovie] = useAtom(movieInModalAtom);
  
  const [isVisible, setIsVisible] = useState(false); 
  const [isMuted, setIsMuted] = useState(true);
  
  // State to handle the "Copied!" visual feedback
  const [isCopied, setIsCopied] = useState(false);

  const movieDetails = movie as unknown as MovieWithDetails;

  const handleClose = useCallback(() => {
    setIsVisible(false); 
    setTimeout(() => {
        setIsOpen(false);
        setMovie(null);
        setIsCopied(false); // Reset copy state when closing
    }, 300); 
  }, [setIsOpen, setMovie]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Function to generate a Deep Link to this specific movie via Search URL
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a URL that automatically searches for this movie title
    // Example: https://netflix-clone.com/?search=Sintel
    const shareUrl = `${window.location.origin}/?search=${encodeURIComponent(movieDetails.title)}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
        setIsCopied(true);
        // Reset the icon back to "Share" after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (!isOpen || !movie) {
    return null;
  }

  return (
    <div 
        onClick={handleClose}
        className="z-50 transition duration-300 bg-black/80 flex justify-center items-start pt-24 overflow-x-hidden overflow-y-auto fixed inset-0"
    >
      <div className="relative w-auto mx-auto max-w-3xl rounded-md overflow-hidden mb-24">
        
        <div 
            onClick={(e) => e.stopPropagation()}
            className={`
                ${isVisible ? 'scale-100' : 'scale-0'}
                transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md
            `}
        >
            
            <div className="relative h-96">
                <Image 
                    src={movie.thumbnailUrl} 
                    alt={movie.title}
                    fill
                    className="w-full h-full object-cover brightness-[60%]"
                />
                
                <div 
                    onClick={handleClose}
                    className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black/70 flex items-center justify-center hover:bg-zinc-800 transition z-50"
                >
                    <X className="text-white w-6" />
                </div>

                <div className="absolute bottom-[10%] left-10 w-[90%] md:w-[60%]">
                    <p className="text-white text-3xl md:text-4xl h-full lg:text-5xl font-bold mb-4">
                        {movie.title}
                    </p>
                    <div className="flex flex-row gap-4 items-center">
                        <button className="bg-white text-black font-bold py-2 md:py-3 px-4 md:px-8 rounded hover:bg-neutral-300 transition flex items-center gap-2">
                             <Play className="w-4 md:w-6 text-black" fill="black" />
                             Play
                        </button>
                        <button className="bg-transparent text-white border-2 border-gray-400 font-bold py-2 md:py-3 px-4 md:px-8 rounded hover:border-white hover:bg-zinc-800 transition flex items-center gap-2">
                             <Plus className="w-4 md:w-6 text-white" />
                             My List
                        </button>
                        
                        {/* SHARE BUTTON */}
                        <div 
                            onClick={handleShare}
                            className={`
                                cursor-pointer h-10 w-10 border-2 rounded-full flex items-center justify-center transition
                                ${isCopied ? 'border-green-500 bg-zinc-800' : 'border-gray-400 hover:border-white hover:bg-zinc-800'}
                            `}
                        >
                            {isCopied ? <Check className="text-green-500 w-5" /> : <Share2 className="text-white w-5" />}
                        </div>

                        {/* Mute Toggle */}
                        <div 
                            onClick={() => setIsMuted(!isMuted)}
                            className="cursor-pointer h-10 w-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:bg-zinc-800 transition"
                        >
                            {isMuted ? <VolumeX className="text-white w-5" /> : <Volume2 className="text-white w-5" />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-12 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-[70%] text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <p className="text-green-400 font-semibold">New 2024</p>
                            <p className="text-white">{movie.duration}</p>
                            <div className="border border-gray-400 px-1 rounded text-[10px]">HD</div>
                        </div>
                        <p className="text-white text-lg leading-relaxed">
                            {movie.description}
                        </p>
                    </div>

                    <div className="w-full md:w-[30%] text-white text-sm flex flex-col gap-2">
                         <p><span className="text-gray-500">Cast:</span> Big Bunny, Rodents</p>
                         <p><span className="text-gray-500">Genres:</span> Comedy, Action</p>
                    </div>
                </div>
                
                {movieDetails.episodes && movieDetails.episodes.length > 0 && (
                    <div className="mt-8 border-t border-zinc-700 pt-8">
                        <h3 className="text-white text-xl font-bold mb-4">
                            Episodes ({movieDetails.episodes.length})
                        </h3>
                        
                        <div className="grid gap-4">
                            {movieDetails.episodes.map((ep, index) => (
                                <div key={ep.id} className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded cursor-pointer transition">
                                    <span className="text-gray-400 font-bold text-xl">{index + 1}</span>
                                    
                                    <div className="w-32 h-20 bg-zinc-700 rounded relative overflow-hidden flex-shrink-0">
                                        <Image 
                                            src={movie.thumbnailUrl} 
                                            alt={ep.title}
                                            fill
                                            className="object-cover opacity-80"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <h4 className="text-white font-bold text-sm md:text-base">{ep.title}</h4>
                                        <p className="text-gray-400 text-xs md:text-sm mt-1 line-clamp-2">{ep.description}</p>
                                    </div>

                                    <span className="text-white text-xs md:text-sm ml-auto">{ep.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default InfoModal;