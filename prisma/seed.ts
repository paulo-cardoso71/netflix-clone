import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Clean up existing data to avoid duplicates during development
  // (Optional: remove these lines if you want to keep old data)
  await prisma.myList.deleteMany();
  await prisma.like.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Database cleaned');

  // 2. Create Tags (Genres)
  const actionTag = await prisma.tag.create({ data: { name: 'Action' } });
  const comedyTag = await prisma.tag.create({ data: { name: 'Comedy' } });
  const dramaTag = await prisma.tag.create({ data: { name: 'Drama' } });
  const scifiTag = await prisma.tag.create({ data: { name: 'Sci-Fi' } });

  console.log('🏷️ Tags created');

  // 3. Create Movies & Shows

  // --- HERO MOVIE (Big Buck Bunny) ---
  await prisma.movie.create({
    data: {
      title: 'Big Buck Bunny',
      description: 'A giant rabbit with a heart bigger than himself. Watch as he seeks revenge on the bullying rodents in this open-source classic.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '10 min',
      rating: 4.8,
      releaseYear: 2008,
      tags: { connect: [{ id: comedyTag.id }, { id: actionTag.id }] },
    },
  });

  // --- SERIES (Sintel) ---
  await prisma.movie.create({
    data: {
      title: 'Sintel',
      description: 'A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. A visually stunning fantasy short.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Sintel_Poster_Paintover_clean.jpg/640px-Sintel_Poster_Paintover_clean.jpg',
      videoUrl: '', 
      duration: '1 Season', 
      rating: 8.8,
      releaseYear: 2010,
      tags: { connect: [{ id: actionTag.id }, { id: dramaTag.id }] },
      episodes: {
        create: [
            { title: 'Chapter 1: The Meeting', description: 'Sintel finds the dragon.', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', duration: '12 min' },
            { title: 'Chapter 2: The Search', description: 'Sintel searches for Scales.', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', duration: '15 min' }
        ]
      }
    }
  });

  // --- MOVIE (Tears of Steel) ---
  await prisma.movie.create({
    data: {
      title: 'Tears of Steel',
      description: 'In a future where humanity is haunted by robots, a group of scientists attempts to save the world from the apocalypse.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tos-poster.png/640px-Tos-poster.png',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: '12 min',
      rating: 7.5,
      releaseYear: 2012,
      tags: { connect: [{ id: scifiTag.id }, { id: actionTag.id }] },
    },
  });

  // --- MOVIE (Elephant's Dream) ---
  await prisma.movie.create({
    data: {
      title: 'Elephants Dream',
      description: 'The story of two characters, Emo and Proog, navigating through a surreal and infinite machine world.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Elephants_Dream_s8_proog.jpg/640px-Elephants_Dream_s8_proog.jpg',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: '11 min',
      rating: 6.9,
      releaseYear: 2006,
      tags: { connect: [{ id: scifiTag.id }, { id: dramaTag.id }] },
    },
  });

   // --- MOVIE (Cosmos Laundromat) ---
   await prisma.movie.create({
    data: {
      title: 'Cosmos Laundromat',
      description: 'On a desolate island, a suicidal sheep named Franck meets a mysterious salesman who offers him the gift of a lifetime.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/CosmosLaundromatPoster.jpg/640px-CosmosLaundromatPoster.jpg',
      videoUrl: '', 
      duration: '10 min',
      rating: 8.0,
      releaseYear: 2015,
      tags: { connect: [{ id: dramaTag.id }, { id: comedyTag.id }] },
    },
  });

  // --- MOVIE (Glass Half) ---
  await prisma.movie.create({
    data: {
      title: 'Glass Half',
      description: 'Two amateur art critics meet at a gallery and argue about what they see in the art pieces.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Glass_Half_-_screenshot-intro_scene.png/640px-Glass_Half_-_screenshot-intro_scene.png',
      videoUrl: '',
      duration: '3 min',
      rating: 6.2,
      releaseYear: 2016,
      tags: { connect: [{ id: comedyTag.id }] },
    },
  });

  // --- MOVIE (Spring) ---
  await prisma.movie.create({
    data: {
      title: 'Spring',
      description: 'A poetic and visually stunning story of a shepherd girl and her dog, who face ancient spirits in order to continue the cycle of life.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Blender_Foundation_-_Spring_-_Closing_title_card.jpg/640px-Blender_Foundation_-_Spring_-_Closing_title_card.jpg',
      videoUrl: '',
      duration: '8 min',
      rating: 7.8,
      releaseYear: 2019,
      tags: { connect: [{ id: dramaTag.id }, { id: scifiTag.id }] },
    },
  });

    // --- MOVIE (Agent 327) ---
    await prisma.movie.create({
      data: {
        title: 'Agent 327',
        description: 'Hendrik IJzerbroot – Agent 327 – faces his most dangerous mission yet in a barbershop.',
        thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Blender_2.79-splash.jpg',
        videoUrl: '',
        duration: '4 min',
        rating: 7.1,
        releaseYear: 2017,
        tags: { connect: [{ id: actionTag.id }, { id: comedyTag.id }] },
      },
    });

  console.log('🎬 Movies created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });