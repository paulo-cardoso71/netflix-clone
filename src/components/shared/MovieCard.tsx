'use client'; 

import React, { useState, useTransition } from 'react'; 
import Image from 'next/image';
import { Movie } from '@prisma/client';
import { Play, Plus, ThumbsUp, ChevronDown, Check } from 'lucide-react'; 
import { toggleMyList } from '@/app/action';
import { useSetAtom } from 'jotai';
import { isModalOpenAtom, movieInModalAtom } from '@/store';

interface MovieCardProps {
  data: Movie;
  // New prop to initialize the state correctly based on server data
  isFavorite?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ data, isFavorite = false }) => {
  const setIsOpen = useSetAtom(isModalOpenAtom);
  const setMovie = useSetAtom(movieInModalAtom);

  const [isPending, startTransition] = useTransition();
  
  // Initialize state with the prop passed from the server
  const [isAdded, setIsAdded] = useState(isFavorite);

  const handleOpenModal = () => {
    setMovie(data);
    setIsOpen(true);
  };

  const handleMyListClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    // Optimistic UI update
    setIsAdded((prev) => !prev);

    startTransition(async () => {
        try {
            await toggleMyList(data.id);
        } catch (error) {
            setIsAdded((prev) => !prev);
            console.error("Failed to update list", error);
        }
    });
  };

  return (
    <div className="group bg-zinc-900 col-span relative h-[12vw] w-full cursor-pointer">
      
      <Image 
        src={data.thumbnailUrl} 
        alt={data.title}
        fill
        className="cursor-pointer object-cover transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 w-full h-[12vw]"
      />

      <div className="opacity-0 absolute top-0 transition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:-translate-y-[6vw] group-hover:translate-x-[2vw] group-hover:opacity-100">
        
        <div className="relative w-full h-[12vw]">
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
                    className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300"
                    onClick={() => { /* Play Logic */ }}
                >
                    <Play className="text-black w-3 lg:w-6" fill="black" />
                </div>

                {/* Toggle Button Logic */}
                <div 
                    onClick={handleMyListClick}
                    className={`
                        cursor-pointer w-6 h-6 lg:w-10 lg:h-10 
                        border-2 rounded-full 
                        flex justify-center items-center 
                        transition 
                        ${isAdded ? 'border-green-500 bg-zinc-700' : 'border-gray-400 hover:border-white hover:bg-zinc-700'}
                    `}
                >
                    {isPending ? (
                         <div className="w-3 h-3 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isAdded ? (
                        <Check className="text-green-500 w-3 lg:w-6" />
                    ) : (
                        <Plus className="text-white w-3 lg:w-6" />
                    )}
                </div>

                <div className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center transition hover:border-white hover:bg-zinc-700">
                    <ThumbsUp className="text-white w-3 lg:w-6" />
                </div>
                
                <div 
                    onClick={handleOpenModal} 
                    className="cursor-pointer ml-auto group/item w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center transition hover:border-white hover:bg-zinc-700"
                >
                    <ChevronDown className="text-white w-3 lg:w-6" />
                </div>
            </div>

            <p className="text-green-400 font-semibold mt-4">
                New <span className="text-white">2024</span>
            </p>

            <div className="flex flex-row mt-2 gap-2 items-center">
                <p className="text-white text-[10px] lg:text-sm">{data.duration}</p>
                <div className="border border-gray-400 px-1 rounded text-[8px] text-white">HD</div>
            </div>
            
            <div className="flex flex-row mt-2 gap-2 items-center text-xs text-gray-400">
               <p>Comedy</p>
               <p>&bull;</p>
               <p>Action</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;