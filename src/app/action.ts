'use server';

import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function toggleMyList(movieId: string) {
  // 1. Get the authenticated user details from Clerk
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 2. DATABASE SYNC: Ensure the user exists in our local database
  // If the user logs in via Clerk but isn't in SQLite yet, Foreign Key constraints will fail.
  // We check for the user and create them if missing.
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    // Create the user locally to satisfy Foreign Key constraints
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

  // 3. Check if the movie is already in the list
  const existingEntry = await prisma.myList.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId: movieId,
      },
    },
  });

  if (existingEntry) {
    // A. If it exists, remove it (Unlike)
    await prisma.myList.delete({
      where: {
        id: existingEntry.id,
      },
    });
    console.log(`Removed movie ${movieId} from user ${user.id}`);
  } else {
    // B. If it doesn't exist, create it (Like)
    // Now this is safe because we guaranteed the User exists in step 2
    await prisma.myList.create({
      data: {
        userId: user.id,
        movieId: movieId,
      },
    });
    console.log(`Added movie ${movieId} to user ${user.id}`);
  }

  // 4. Revalidate the path so the UI updates immediately
  revalidatePath("/"); 
}

export async function toggleLike(movieId: string) {
  // 1. Authenticate User
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 2. Sync User to Database (Safety Check)
  // We repeat this check here to ensure the user exists before creating a Like relation
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

  // 3. Check if Like already exists
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId: movieId,
      },
    },
  });

  if (existingLike) {
    // If liked, remove it (Unlike)
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    console.log(`User ${user.id} unliked movie ${movieId}`);
  } else {
    // If not liked, add it
    await prisma.like.create({
      data: {
        userId: user.id,
        movieId: movieId,
      },
    });
    console.log(`User ${user.id} liked movie ${movieId}`);
  }

  // 4. Update UI
  revalidatePath("/");
}