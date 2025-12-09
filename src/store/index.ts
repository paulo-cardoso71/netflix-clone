import { atom } from 'jotai';
import { Movie } from '@prisma/client';

// Define a extended type to include relations (optional for now, but good practice)
// This tells TypeScript that our movie might have extra data attached later
export type MovieWithDetails = Movie & {
  // We will add relations like genres/episodes here later
};

// Atom to control if the modal is visible (true/false)
export const isModalOpenAtom = atom(false);

// Atom to store the data of the movie currently being displayed in the modal
export const movieInModalAtom = atom<Movie | null>(null);