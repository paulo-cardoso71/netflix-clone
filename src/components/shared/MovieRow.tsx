import React from 'react';
import { Movie } from '@prisma/client';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        {/* Row Title (e.g., "Trending Now", "Comedy") */}
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
          {title}
        </p>
        
        {/* Grid Container for Movies (Simplified for now, later we add Carousel/Slider) */}
        <div className="grid grid-cols-4 gap-2">
          {movies.map((movie) => (
            <MovieCard key={movie.id} data={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;