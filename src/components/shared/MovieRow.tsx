import React from 'react';
import { Movie } from '@prisma/client';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  // Receive the list of favorite IDs from the parent (Page)
  userFavorites?: string[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, userFavorites = [] }) => {
  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
          {title}
        </p>
        
        <div className="grid grid-cols-4 gap-2">
          {movies.map((movie) => (
            <MovieCard 
                key={movie.id} 
                data={movie} 
                // Check if THIS movie ID exists in the user's favorites list
                isFavorite={userFavorites.includes(movie.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;