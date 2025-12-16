import React from 'react';
// 1. IMPORTAMOS OS SUB-TIPOS NECESSÁRIOS
import { Movie, Tag, Actor, Episode } from '@prisma/client';
import MovieCard from './MovieCard';

// 2. CRIAMOS A TIPAGEM RICA (IGUAL NO HERO)
interface MovieWithDetails extends Movie {
  tags: Tag[];
  actors: Actor[];
  episodes: Episode[];
}

interface MovieRowProps {
  title: string;
  movies: MovieWithDetails[];
  userFavorites?: string[];
  userLikes?: string[];
}

const MovieRow: React.FC<MovieRowProps> = ({ 
  title, 
  movies, 
  userFavorites = [], 
  userLikes = [] 
}) => {
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
                isFavorite={userFavorites.includes(movie.id)}
                isLiked={userLikes.includes(movie.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;