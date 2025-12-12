import { atom } from 'jotai';
import { Movie, Tag, Actor, Episode } from '@prisma/client';

// Define the full type with relations included
export type MovieWithDetails = Movie & {
  tags: Tag[];
  actors: Actor[];
  episodes: Episode[];
};

export const isModalOpenAtom = atom(false);
export const movieInModalAtom = atom<MovieWithDetails | null>(null);

// NEW: Store the interaction state (Like/Favorite) passed from the Card
export const modalStateAtom = atom<{ isFavorite: boolean; isLiked: boolean }>({
  isFavorite: false,
  isLiked: false,
});