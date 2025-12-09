'use client';

import React from 'react';
import Image from 'next/image';
import { Movie } from '@prisma/client';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react'; 

interface MovieCardProps {
  data: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
  return (
    // Main Container
    // 'group' allows us to control child styles when hovering over this parent
    <div className="group bg-zinc-900 col-span relative h-[12vw] w-full cursor-pointer">
      
      {/* 1. DEFAULT STATE (Static Image) 
          Visible when NOT hovering. 
          Disappears on hover (opacity-0) to reveal the expanded card below.
      */}
      <Image 
        src={data.thumbnailUrl} 
        alt={data.title}
        fill
        className="
          cursor-pointer
          object-cover
          transition
          duration
          shadow-xl
          rounded-md
          group-hover:opacity-90
          sm:group-hover:opacity-0
          delay-300
          w-full
          h-[12vw]
        "
      />

      {/* 2. HOVER STATE (Expanded Preview) 
          Initially invisible (opacity-0).
          Becomes visible on hover with a scale effect and Z-index boost.
      */}
      <div className="
        opacity-0
        absolute
        top-0
        transition
        duration-200
        z-10
        invisible
        sm:visible
        delay-300
        w-full
        scale-0
        group-hover:scale-110
        group-hover:-translate-y-[6vw]
        group-hover:translate-x-[2vw]
        group-hover:opacity-100
      ">
        {/* Preview Image (Top part of the expanded card) */}
        <div className="relative w-full h-[12vw]">
            <Image 
                src={data.thumbnailUrl} 
                alt={data.title}
                fill
                className="
                cursor-pointer
                object-cover
                transition
                duration
                shadow-xl
                rounded-t-md
                w-full
                h-[12vw]
                "
            />
        </div>

        {/* Content Area (Dark background below the image) */}
        <div className="
            z-10
            bg-zinc-800
            p-2
            lg:p-4
            absolute
            w-full
            transition
            shadow-md
            rounded-b-md
        ">
            {/* Action Buttons Row */}
            <div className="flex flex-row items-center gap-3">
                {/* Play Button - White Background */}
                <div 
                    className="
                        cursor-pointer w-6 h-6 lg:w-10 lg:h-10 
                        bg-white rounded-full flex justify-center items-center 
                        transition hover:bg-neutral-300
                    "
                    onClick={() => { /* TODO: Add Navigation to Watch */ }}
                >
                    <Play className="text-black w-3 lg:w-6" fill="black" />
                </div>

                {/* Add to List Button */}
                <div className="
                    cursor-pointer w-6 h-6 lg:w-10 lg:h-10 
                    border-2 border-gray-400 rounded-full 
                    flex justify-center items-center 
                    transition hover:border-white hover:bg-zinc-700
                ">
                    <Plus className="text-white w-3 lg:w-6" />
                </div>

                {/* Like Button */}
                <div className="
                    cursor-pointer w-6 h-6 lg:w-10 lg:h-10 
                    border-2 border-gray-400 rounded-full 
                    flex justify-center items-center 
                    transition hover:border-white hover:bg-zinc-700
                ">
                    <ThumbsUp className="text-white w-3 lg:w-6" />
                </div>
                
                {/* More Info Button (Push to right) */}
                <div className="
                    cursor-pointer ml-auto group/item w-6 h-6 lg:w-10 lg:h-10 
                    border-2 border-gray-400 rounded-full 
                    flex justify-center items-center 
                    transition hover:border-white hover:bg-zinc-700
                ">
                    <ChevronDown className="text-white w-3 lg:w-6" />
                </div>
            </div>

            {/* Metadata Row */}
            <p className="text-green-400 font-semibold mt-4">
                New <span className="text-white">2025</span>
            </p>

            <div className="flex flex-row mt-2 gap-2 items-center">
                <p className="text-white text-[10px] lg:text-sm">{data.duration}</p>
                <div className="border border-gray-400 px-1 rounded text-[8px] text-white">HD</div>
            </div>
            
            {/* Genres Row */}
            <div className="flex flex-row mt-2 gap-2 items-center text-xs text-gray-400">
               {/* Static genre for now, later we map from data.tags */}
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