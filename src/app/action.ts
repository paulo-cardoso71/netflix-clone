'use server';

import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// =========================================================
// ACTION 1: MY LIST (Favorites)
// =========================================================

export async function toggleMyList(movieId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Sync User
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
      },
    });
    console.log(`Synced user ${user.id} to local database.`);
  }

  const existingEntry = await prisma.myList.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId: movieId,
      },
    },
  });

  if (existingEntry) {
    await prisma.myList.delete({
      where: { id: existingEntry.id },
    });
    console.log(`Removed movie ${movieId} from user ${user.id}`);
  } else {
    await prisma.myList.create({
      data: {
        userId: user.id,
        movieId: movieId,
      },
    });
    console.log(`Added movie ${movieId} to user ${user.id}`);
  }

  revalidatePath("/"); 
}

// =========================================================
// ACTION 2: LIKE SYSTEM (Thumbs Up)
// =========================================================

export async function toggleLike(movieId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Sync User
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
      },
    });
  }

  // LOGIC FIX: If user Likes, we must remove Dislike if it exists (Mutually Exclusive)
  const existingDislike = await prisma.dislike.findUnique({
    where: { userId_movieId: { userId: user.id, movieId: movieId } }
  });

  if (existingDislike) {
    await prisma.dislike.delete({ where: { id: existingDislike.id } });
  }

  // Toggle Like
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId: movieId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    console.log(`User ${user.id} unliked movie ${movieId}`);
  } else {
    await prisma.like.create({
      data: {
        userId: user.id,
        movieId: movieId,
      },
    });
    console.log(`User ${user.id} liked movie ${movieId}`);
  }

  revalidatePath("/");
} // <--- FIX: This closing brace was missing or misplaced!

// =========================================================
// ACTION 3: DISLIKE SYSTEM (Thumbs Down)
// =========================================================

export async function toggleDislike(movieId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Sync User
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
      },
    });
  }

  // Logic: If Disliking, remove Like if it exists
  const existingLike = await prisma.like.findUnique({
    where: { userId_movieId: { userId: user.id, movieId: movieId } }
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  }

  // Toggle Dislike
  const existingDislike = await prisma.dislike.findUnique({
    where: { userId_movieId: { userId: user.id, movieId: movieId } }
  });

  if (existingDislike) {
    await prisma.dislike.delete({ where: { id: existingDislike.id } }); 
  } else {
    await prisma.dislike.create({
      data: { userId: user.id, movieId: movieId }
    }); 
  }

  revalidatePath("/");
}

// =========================================================
// ACTION 4: RECOMMENDATION SYSTEM (More Like This)
// =========================================================

export async function getRecommendations(movieId: string) {
  // 1. Find the current movie's tags
  const currentMovie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: { tags: true }
  });

  if (!currentMovie || currentMovie.tags.length === 0) {
    return [];
  }

  // 2. Extract Tag IDs (e.g., ID for "Action", ID for "Comedy")
  const tagIds = currentMovie.tags.map(tag => tag.id);

  // 3. Find other movies that share at least one tag
  const recommendations = await prisma.movie.findMany({
    take: 6, // Limit to 6 suggestions
    where: {
      id: { not: movieId }, // Exclude the movie currently shown
      tags: {
        some: {
          id: { in: tagIds } // Magic: "Where tag ID is in our list"
        }
      }
    },
    include: { tags: true, actors: true, episodes: true },
    orderBy: { createdAt: 'desc' }
  });

  return recommendations;
}