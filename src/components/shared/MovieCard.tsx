'use client'; 

import React, { useState, useTransition, useEffect } from 'react'; 
import Image from 'next/image';
import { Movie, Tag, Actor, Episode } from '@prisma/client'; 
import { Play, Plus, ThumbsUp, ChevronDown, Check } from 'lucide-react'; 
import { toggleMyList, toggleLike } from '@/app/action';
import { useSetAtom } from 'jotai';
import { isModalOpenAtom, movieInModalAtom, modalStateAtom } from '@/store';
import { useRouter } from 'next/navigation';

interface MovieWithDetails extends Movie {
    tags: Tag[];
    actors: Actor[];
    episodes: Episode[];
}

interface MovieCardProps {
  data: MovieWithDetails;
  isFavorite?: boolean;
  isLiked?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
    data, 
    isFavorite = false, 
    isLiked = false 
}) => {
  const router = useRouter();
  const setIsOpen = useSetAtom(isModalOpenAtom);
  const setMovie = useSetAtom(movieInModalAtom);
  const setModalState = useSetAtom(modalStateAtom);

  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(isFavorite);
  const [isThumbsUp, setIsThumbsUp] = useState(isLiked);

  useEffect(() => {
    setIsAdded(isFavorite || false);
    setIsThumbsUp(isLiked || false);
  }, [isFavorite, isLiked]);

  const handleOpenModal = () => {
    setMovie(data);
    setModalState({
       isFavorite: isAdded,
       isLiked: isThumbsUp
    });
    setIsOpen(true);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${data.id}`);
  };

  const handleMyListClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsAdded((prev) => !prev); 
    startTransition(async () => {
        try { await toggleMyList(data.id); } 
        catch (error) { setIsAdded((prev) => !prev); }
    });
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsThumbsUp((prev) => !prev);
    startTransition(async () => {
        try { await toggleLike(data.id); } 
        catch (error) { setIsThumbsUp((prev) => !prev); }
    });
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="group bg-zinc-900 col-span relative h-[12vw] w-full cursor-pointer">
      
      <div onClick={handleOpenModal}>
          <Image 
            src={data.thumbnailUrl} 
            alt={data.title}
            fill
            className="cursor-pointer object-cover transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 w-full h-[12vw]"
          />
      </div>

      <div className="opacity-0 absolute top-0 transition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:-translate-y-[6vw] group-hover:translate-x-[2vw] group-hover:opacity-100">
        
        <div onClick={handleOpenModal} className="relative w-full h-[12vw]">
            <Image 
                src={data.thumbnailUrl} 
                alt={data.title}
                fill
                className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full h-[12vw]"
            />
        </div>

        <div className="z-10 bg-zinc-800 p-2 lg:p-4 absolute w-full transition shadow-md rounded-b-md">
            <div className="flex flex-row items-center gap-3">
                <div 
                    onClick={handlePlay}
                    className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300"
                >
                    <Play className="text-black w-3 lg:w-6" fill="black" />
                </div>

                <div 
                    onClick={handleMyListClick}
                    className={`cursor-pointer w-6 h-6 lg:w-10 lg:h-10 border-2 rounded-full flex justify-center items-center transition ${isAdded ? 'border-green-500 bg-zinc-700' : 'border-gray-400 hover:border-white hover:bg-zinc-700'}`}
                >
                    {isAdded ? <Check className="text-green-500 w-3 lg:w-6" /> : <Plus className="text-white w-3 lg:w-6" />}
                </div>

                <div 
                    onClick={handleLikeClick}
                    className={`cursor-pointer w-6 h-6 lg:w-10 lg:h-10 border-2 rounded-full flex justify-center items-center transition ${isThumbsUp ? 'border-green-500 bg-zinc-700' : 'border-gray-400 hover:border-white hover:bg-zinc-700'}`}
                >
                    <ThumbsUp className={`w-3 lg:w-6 ${isThumbsUp ? 'text-green-500' : 'text-white'}`} fill={isThumbsUp ? "currentColor" : "none"} />
                </div>
                
                <div onClick={handleOpenModal} className="cursor-pointer ml-auto group/item w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center transition hover:border-white hover:bg-zinc-700">
                    <ChevronDown className="text-white w-3 lg:w-6" />
                </div>
            </div>

            <p className="text-green-400 font-semibold mt-4 text-xs lg:text-sm">
                New <span className="text-white">{currentYear}</span>
            </p>

            <div className="flex flex-row mt-2 gap-2 items-center">
                <p className="text-white text-[10px] lg:text-sm">{data.duration}</p>
                <div className="border border-gray-400 px-1 rounded text-[8px] text-white">HD</div>
            </div>
            
            {/* CORREÇÃO: Tamanho text-xs e cor gray-400 conforme seu pedido */}
            <div className="flex flex-row mt-2 gap-2 items-center text-xs text-gray-400">
               {data.tags && data.tags.length > 0 ? (
                   <p>{data.tags.map(tag => tag.name).join(' • ')}</p>
               ) : (
                   <p>Unknown Genre</p> 
               )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;