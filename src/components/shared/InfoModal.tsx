'use client'; 

import React, { useCallback, useEffect, useState, useTransition } from 'react';
import { X, Play, Plus, Volume2, VolumeX, Share2, Check, ThumbsUp, ThumbsDown } from 'lucide-react'; 
import { useAtom, useAtomValue } from 'jotai';
import { isModalOpenAtom, movieInModalAtom, modalStateAtom } from '@/store'; 
import Image from 'next/image';
import { toggleMyList, toggleLike, toggleDislike, getRecommendations } from '@/app/action'; 
import { useRouter } from 'next/navigation'; 
import MovieCard from './MovieCard'; 
import { Movie } from '@prisma/client';

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

  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsFavorite(initialModalState?.isFavorite ?? false);
        setIsLiked(initialModalState?.isLiked ?? false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialModalState]);

  useEffect(() => {
    async function loadData() {
        if (movie?.id) {
            const data = await getRecommendations(movie.id);
            setRecommendations(data);
        }
    }
    if (isOpen) {
        loadData();
    }
  }, [movie, isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false); 
    setTimeout(() => {
        setIsOpen(false);
        setMovie(null);
        setIsCopied(false);
        setRecommendations([]); 
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
    <div onClick={handleClose} className="z-50 transition duration-300 bg-black/80 flex justify-center items-start pt-24 overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-full mx-4 md:mx-auto max-w-3xl rounded-md overflow-hidden mb-24">
        <div onClick={(e) => e.stopPropagation()} className={`${isVisible ? 'scale-100' : 'scale-0'} transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md rounded-md`}>
            
            {/* --- HEADER (IMAGEM) --- */}
            <div className="relative h-96">
                <Image src={movie.thumbnailUrl} alt={movie.title} fill className="w-full h-full object-cover brightness-60" />
                
                {/* Fechar */}
                <div onClick={handleClose} className="cursor-pointer absolute top-3 right-3 h-8 w-8 md:h-10 md:w-10 rounded-full bg-black/70 flex items-center justify-center hover:bg-zinc-800 transition z-50">
                    <X className="text-white w-4 md:w-6" />
                </div>

                {/* Volume - Ajustado para não bater no texto no celular */}
                <div 
                    onClick={() => setIsMuted(!isMuted)}
                    className="hidden md:flex cursor-pointer absolute bottom-28 md:bottom-10 right-4 md:right-10 h-8 w-8 md:h-10 md:w-10 rounded-full bg-black/50 border border-gray-500 flex items-center justify-center hover:bg-zinc-800 transition z-50"
                >
                    {isMuted ? <VolumeX className="text-white w-4 md:w-5" /> : <Volume2 className="text-white w-4 md:w-5" />}
                </div>

                {/* Container de Título e Botões */}
                <div className="absolute bottom-4 left-4 w-full md:bottom-[10%] md:left-10 md:w-[60%]">
                    {/* Título: Menor no mobile */}
                    <p className="text-white text-xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-4 drop-shadow-md">
                        {movie.title}
                    </p>
                    
                    {/* Botões: Flexível, wrap e itens menores no mobile */}
                    <div className="flex flex-row items-center gap-2 md:gap-4 flex-wrap">
                        
                        {/* Play Button */}
                        <button className="h-8 md:h-12 bg-white text-black font-bold px-3 md:px-6 rounded hover:bg-neutral-300 transition flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap text-xs md:text-base">
                             <Play className="w-3 h-3 md:w-5 md:h-5 text-black" fill="black" /> Play
                        </button>

                        {/* My List Button */}
                        <button 
                            onClick={handleMyList}
                            className={`
                                h-8 md:h-12 font-bold px-3 md:px-6 rounded border-2 flex items-center justify-center gap-1 md:gap-2 transition whitespace-nowrap text-xs md:text-base
                                ${isFavorite ? 'bg-zinc-600 hover:bg-zinc-700 text-white border-zinc-600' : 'bg-zinc-600/60 hover:bg-zinc-600/80 text-white border-transparent'} 
                            `}
                        >
                             {isFavorite ? <Check className="w-3 h-3 md:w-5 md:h-5" /> : <Plus className="w-3 h-3 md:w-5 md:h-5" />} My List
                        </button>
                        
                        {/* Like Button */}
                        <div onClick={handleLike} className={`cursor-pointer w-8 h-8 md:w-12 md:h-12 shrink-0 rounded-full border-2 flex items-center justify-center transition ${isLiked ? 'border-green-500 bg-zinc-800' : 'border-gray-400 hover:border-white hover:bg-zinc-800'}`}>
                            <ThumbsUp className={`w-3 h-3 md:w-5 md:h-5 ${isLiked ? 'text-green-500' : 'text-white'}`} fill={isLiked ? "currentColor" : "none"} />
                        </div>

                        {/* Dislike Button */}
                        <div onClick={handleDislike} className={`cursor-pointer w-8 h-8 md:w-12 md:h-12 shrink-0 rounded-full border-2 flex items-center justify-center transition ${isDisliked ? 'border-red-500 bg-zinc-800' : 'border-gray-400 hover:border-white hover:bg-zinc-800'}`}>
                            <ThumbsDown className={`w-3 h-3 md:w-5 md:h-5 ${isDisliked ? 'text-red-500' : 'text-white'}`} />
                        </div>

                        {/* Share Button */}
                        <div onClick={handleShare} className={`cursor-pointer w-8 h-8 md:w-12 md:h-12 shrink-0 rounded-full border-2 flex items-center justify-center transition ${isCopied ? 'border-green-500 bg-zinc-800' : 'border-gray-400 hover:border-white hover:bg-zinc-800'}`}>
                            {isCopied ? <Check className="text-green-500 w-3 h-3 md:w-5 md:h-5" /> : <Share2 className="text-white w-3 h-3 md:w-5 md:h-5" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BODY (DETALHES) --- */}
            <div className="px-4 md:px-12 py-8 pb-40">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    <div className="w-full md:w-[70%] text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <p className="text-green-400 font-semibold text-sm md:text-base">New {new Date().getFullYear()}</p>
                            <p className="text-white font-light text-sm md:text-base">{movie.releaseYear}</p>
                            <p className="text-white text-sm md:text-base">{movie.duration}</p>
                            <div className="border border-gray-400 px-1 rounded text-[10px]">HD</div>
                        </div>
                        {/* Descrição com texto menor no mobile */}
                        <p className="text-white text-sm md:text-lg leading-relaxed">{movie.description}</p>
                    </div>
                    
                    <div className="w-full md:w-[30%] text-white text-xs md:text-sm flex flex-col gap-2">
                         {movie.actors && movie.actors.length > 0 ? (
                            <p><span className="text-gray-500">Cast:</span> {movie.actors.map(a => a.fullName).join(', ')}</p>
                         ) : (<p><span className="text-gray-500">Cast:</span> <span className="text-zinc-600">No Information</span></p>)}
                         
                         {movie.tags && movie.tags.length > 0 && (
                             <p><span className="text-gray-500">Genres:</span> {movie.tags.map(t => t.name).join(', ')}</p>
                         )}
                    </div>
                </div>
                
                {movie.episodes && movie.episodes.length > 0 && (
                    <div className="mt-8 border-t border-zinc-700 pt-8">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4">Episodes ({movie.episodes.length})</h3>
                        <div className="grid gap-4">
                            {movie.episodes.map((ep, index) => (
                                <div key={ep.id} className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded cursor-pointer transition">
                                    <span className="text-gray-400 font-bold text-lg md:text-xl">{index + 1}</span>
                                    <div className="w-24 h-16 md:w-32 md:h-20 bg-zinc-700 rounded relative overflow-hidden shrink-0">
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

                <div className="mt-8 border-t border-zinc-700 pt-8">
                    <h3 className="text-white text-lg md:text-xl font-bold mb-4">
                        More Like This
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {recommendations.map((rec) => (
                            <MovieCard 
                                key={rec.id} 
                                data={rec} 
                            />
                        ))}
                    </div>
                    
                    {recommendations.length === 0 && (
                        <p className="text-gray-500 text-sm">No similar titles found.</p>
                    )}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;