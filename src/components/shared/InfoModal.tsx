'use client'; 

import React, { useCallback, useEffect, useState, useTransition } from 'react';
import { X, Play, Plus, Volume2, VolumeX, Share2, Check, ThumbsUp, ThumbsDown } from 'lucide-react'; 
import { useAtom, useAtomValue } from 'jotai';
import { isModalOpenAtom, movieInModalAtom, modalStateAtom } from '@/store'; 
import Image from 'next/image';
import { toggleMyList, toggleLike, toggleDislike } from '@/app/action'; 
import { useRouter } from 'next/navigation'; 

const InfoModal = () => {
  const router = useRouter(); 
  const [isOpen, setIsOpen] = useAtom(isModalOpenAtom);
  const [movie, setMovie] = useAtom(movieInModalAtom);
  const initialModalState = useAtomValue(modalStateAtom);
  
  const [isVisible, setIsVisible] = useState(false); 
  const [isMuted, setIsMuted] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false); 
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsFavorite(initialModalState?.isFavorite ?? false);
        setIsLiked(initialModalState?.isLiked ?? false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialModalState]);

  const handleClose = useCallback(() => {
    setIsVisible(false); 
    setTimeout(() => {
        setIsOpen(false);
        setMovie(null);
        setIsCopied(false);
    }, 300); 
  }, [setIsOpen, setMovie]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => { setIsVisible(true); }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?search=${encodeURIComponent(movie?.title || '')}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleMyList = () => {
    if (!movie) return;
    setIsFavorite((prev) => !prev); 
    startTransition(async () => { 
        await toggleMyList(movie.id); 
        router.refresh(); 
    });
  };

  const handleLike = () => {
    if (!movie) return;
    if (!isLiked) setIsDisliked(false);
    setIsLiked((prev) => !prev); 
    startTransition(async () => { 
        await toggleLike(movie.id);
        router.refresh(); 
    });
  };

  const handleDislike = () => {
    if (!movie) return;
    if (!isDisliked) setIsLiked(false);
    setIsDisliked((prev) => !prev);
    startTransition(async () => {
        await toggleDislike(movie.id);
        router.refresh();
    });
  };

  if (!isOpen || !movie) return null;

  return (
    <div onClick={handleClose} className="z-[100] transition duration-300 bg-black/80 flex justify-center items-start pt-24 overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-full mx-4 md:mx-auto max-w-3xl rounded-md overflow-hidden mb-24">
        <div onClick={(e) => e.stopPropagation()} className={`${isVisible ? 'scale-100' : 'scale-0'} transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md rounded-md`}>
            
            <div className="relative h-96">
                <Image src={movie.thumbnailUrl} alt={movie.title} fill className="w-full h-full object-cover brightness-[60%]" />
                
                {/* CLOSE BUTTON (Top Right) */}
                <div onClick={handleClose} className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black/70 flex items-center justify-center hover:bg-zinc-800 transition z-50">
                    <X className="text-white w-6" />
                </div>

                {/* VOLUME BUTTON (Moved to Bottom Right Overlay) */}
                <div 
                    onClick={() => setIsMuted(!isMuted)}
                    className="cursor-pointer absolute bottom-10 right-10 h-10 w-10 rounded-full bg-black/50 border border-gray-500 flex items-center justify-center hover:bg-zinc-800 transition z-50"
                >
                    {isMuted ? <VolumeX className="text-white w-5" /> : <Volume2 className="text-white w-5" />}
                </div>

                <div className="absolute bottom-[10%] left-10 w-[90%] md:w-[60%]">
                    <p className="text-white text-3xl md:text-4xl h-full lg:text-5xl font-bold mb-4">{movie.title}</p>
                    
                    {/* ACTION BUTTONS ROW - Simplified and Aligned */}
                    <div className="flex flex-row items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        
                        {/* PLAY */}
                        <button className="h-10 md:h-12 bg-white text-black font-bold px-6 rounded hover:bg-neutral-300 transition flex items-center justify-center gap-2 whitespace-nowrap">
                             <Play className="w-5 h-5 text-black" fill="black" /> 
                             Play
                        </button>

                        {/* MY LIST */}
                        <button 
                            onClick={handleMyList}
                            className={`
                                h-10 md:h-12 
                                font-bold px-6 rounded border-2 flex items-center justify-center gap-2 transition whitespace-nowrap
                                ${isFavorite 
                                    ? 'bg-zinc-600 hover:bg-zinc-700 text-white border-zinc-600' 
                                    : 'bg-zinc-600/60 hover:bg-zinc-600/80 text-white border-transparent'} 
                            `}
                        >
                             {isFavorite ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                             My List
                        </button>
                        
                        {/* ROUND BUTTONS GROUP */}
                         <div 
                            onClick={handleLike}
                            className={`
                                cursor-pointer w-10 h-10 md:w-12 md:h-12 flex-shrink-0
                                rounded-full border-2 flex items-center justify-center transition
                                ${isLiked ? 'border-green-500 bg-zinc-800' : 'border-gray-400 hover:border-white hover:bg-zinc-800'}
                            `}
                        >
                            <ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-green-500' : 'text-white'}`} />
                        </div>

                        <div 
                            onClick={handleDislike}
                            className={`
                                cursor-pointer w-10 h-10 md:w-12 md:h-12 flex-shrink-0
                                rounded-full border-2 flex items-center justify-center transition
                                ${isDisliked ? 'border-red-500 bg-zinc-800' : 'border-gray-400 hover:border-white hover:bg-zinc-800'}
                            `}
                        >
                            <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'text-red-500' : 'text-white'}`} />
                        </div>

                        <div 
                            onClick={handleShare}
                            className={`
                                cursor-pointer w-10 h-10 md:w-12 md:h-12 flex-shrink-0
                                rounded-full border-2 flex items-center justify-center transition
                                ${isCopied ? 'border-green-500 bg-zinc-800' : 'border-gray-400 hover:border-white hover:bg-zinc-800'}
                            `}
                        >
                            {isCopied ? <Check className="text-green-500 w-5 h-5" /> : <Share2 className="text-white w-5 h-5" />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-12 py-8">
                {/* DETAILS SECTION */}
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-[70%] text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <p className="text-green-400 font-semibold">New {movie.releaseYear}</p>
                            <p className="text-white">{movie.duration}</p>
                            <div className="border border-gray-400 px-1 rounded text-[10px]">HD</div>
                        </div>
                        <p className="text-white text-lg leading-relaxed">{movie.description}</p>
                    </div>
                    <div className="w-full md:w-[30%] text-white text-sm flex flex-col gap-2">
                         {movie.actors && movie.actors.length > 0 ? (
                            <p><span className="text-gray-500">Cast:</span> {movie.actors.map(a => a.fullName).join(', ')}</p>
                         ) : (<p><span className="text-gray-500">Cast:</span> <span className="text-zinc-600">No Information</span></p>)}
                         
                         {movie.tags && movie.tags.length > 0 && (
                             <p><span className="text-gray-500">Genres:</span> {movie.tags.map(t => t.name).join(', ')}</p>
                         )}
                    </div>
                </div>
                
                {/* EPISODES LIST */}
                {movie.episodes && movie.episodes.length > 0 && (
                    <div className="mt-8 border-t border-zinc-700 pt-8">
                        <h3 className="text-white text-xl font-bold mb-4">Episodes ({movie.episodes.length})</h3>
                        <div className="grid gap-4">
                            {movie.episodes.map((ep, index) => (
                                <div key={ep.id} className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded cursor-pointer transition">
                                    <span className="text-gray-400 font-bold text-xl">{index + 1}</span>
                                    <div className="w-32 h-20 bg-zinc-700 rounded relative overflow-hidden flex-shrink-0">
                                        <Image src={ep.thumbnailUrl || movie.thumbnailUrl} alt={ep.title} fill className="object-cover opacity-80" />
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