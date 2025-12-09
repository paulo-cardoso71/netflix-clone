// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // 1. Clear old database data (optional, be careful in production)
  // We clean up previous data to avoid conflicts during development testing
  await prisma.myList.deleteMany()
  await prisma.episode.deleteMany()
  await prisma.actor.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.tag.deleteMany()

  // 2. Create Tags (Categories)
  const actionTag = await prisma.tag.create({ data: { name: 'Action' } })
  const comedyTag = await prisma.tag.create({ data: { name: 'Comedy' } })
  const dramaTag = await prisma.tag.create({ data: { name: 'Drama' } })

  // 3. Create Actors
  const actor1 = await prisma.actor.create({ 
    data: { 
        fullName: 'Big Bunny', 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg' 
    } 
  })

  // 4. Create Main Movie (Big Buck Bunny)
  // This movie serves as our initial "Hero" content to populate the UI
  await prisma.movie.create({
    data: {
      title: 'Big Buck Bunny',
      description: 'A giant rabbit with a heart bigger than himself.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '10 min',
      rating: 9.5,
      releaseYear: 2008,
      tags: {
        connect: [{ id: comedyTag.id }, { id: actionTag.id }]
      },
      actors: {
        connect: [{ id: actor1.id }]
      }
    }
  })

  //Create a TV Show (Sintel) to test Episodes Logic
  const series = await prisma.movie.create({
    data: {
      title: 'Sintel',
      description: 'A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. A visually stunning fantasy short.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
      videoUrl: '', // Series don't have a single video URL, episodes do
      duration: '1 Season', // Display text for Series
      rating: 8.8,
      releaseYear: 2010,
      tags: {
        connect: [{ id: actionTag.id }, { id: dramaTag.id }]
      },
      // Here we add Episodes
      episodes: {
        create: [
            {
                title: 'Chapter 1: The Meeting',
                description: 'Sintel finds the dragon.',
                videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                duration: '12 min'
            },
            {
                title: 'Chapter 2: The Search',
                description: 'Sintel searches for Scales.',
                videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                duration: '15 min'
            }
        ]
      }
    }
  })

  console.log('✅ Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })