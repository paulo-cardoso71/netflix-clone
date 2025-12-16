import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VIDEOS = {
  BUNNY: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  SINTEL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  TEARS: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  ELEPHANT: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
};

async function main() {
  // 1. Clean up
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
  const animeTag = await prisma.tag.create({ data: { name: 'Anime' } });

  console.log('🏷️ Tags created');

  // 3. FILMES ORIGINAIS (Mantidos 100% iguais)

  // --- HERO MOVIE (Big Buck Bunny) ---
  await prisma.movie.create({
    data: {
      title: 'Big Buck Bunny',
      description: 'A giant rabbit with a heart bigger than himself. Watch as he seeks revenge on the bullying rodents in this open-source classic.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
      videoUrl: VIDEOS.BUNNY,
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
      videoUrl: VIDEOS.SINTEL,
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
      videoUrl: VIDEOS.TEARS,
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
      videoUrl: VIDEOS.ELEPHANT,
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
      videoUrl: VIDEOS.BUNNY,
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
      videoUrl: VIDEOS.BUNNY,
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
      videoUrl: VIDEOS.SINTEL,
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
        videoUrl: VIDEOS.TEARS,
        duration: '4 min',
        rating: 7.1,
        releaseYear: 2017,
        tags: { connect: [{ id: actionTag.id }, { id: comedyTag.id }] },
      },
    });

  // ==========================================================
  // PARTE 2: BLOCKBUSTERS (CORRIGIDOS E MANTIDOS)
  // ==========================================================

  // INTERSTELLAR [CORRIGIDO - Link TMDB quebrado -> Wikimedia]
  await prisma.movie.create({
    data: {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      thumbnailUrl: "/images/interstellar.jpg", // Imagem Galáxia NASA
      videoUrl: VIDEOS.TEARS,
      duration: "2h 49m",
      rating: 9.2,
      releaseYear: 2014,
      tags: { connect: [{ id: scifiTag.id }, { id: dramaTag.id }] }
    }
  });

  // INCEPTION [MANTIDO - Você disse que funciona]
  await prisma.movie.create({
    data: {
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      thumbnailUrl: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      videoUrl: VIDEOS.ELEPHANT,
      duration: "2h 28m",
      rating: 8.8,
      releaseYear: 2010,
      tags: { connect: [{ id: scifiTag.id }, { id: actionTag.id }] }
    }
  });

  // THE DARK KNIGHT [CORRIGIDO - Link TMDB quebrado -> Wikimedia]
  await prisma.movie.create({
    data: {
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      thumbnailUrl: "/images/dark-knight.jpg",
      videoUrl: VIDEOS.TEARS,
      duration: "2h 32m",
      rating: 9.0,
      releaseYear: 2008,
      tags: { connect: [{ id: actionTag.id }, { id: dramaTag.id }] }
    }
  });

  // AVENGERS ENDGAME [MANTIDO - Você disse que funciona]
  await prisma.movie.create({
    data: {
      title: "Avengers: Endgame",
      description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
      thumbnailUrl: "https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      videoUrl: VIDEOS.TEARS,
      duration: "3h 1m",
      rating: 8.9,
      releaseYear: 2019,
      tags: { connect: [{ id: actionTag.id }, { id: scifiTag.id }] }
    }
  });

  // SPIDER-MAN [MANTIDO - Você disse que funciona]
  await prisma.movie.create({
    data: {
      title: "Spider-Man: Across the Spider-Verse",
      description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
      thumbnailUrl: "https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      videoUrl: VIDEOS.SINTEL,
      duration: "2h 20m",
      rating: 9.1,
      releaseYear: 2023,
      tags: { connect: [{ id: actionTag.id }, { id: animeTag.id }] }
    }
  });

  // SUPERBAD [CORRIGIDO - Link TMDB quebrado -> Wikimedia]
  await prisma.movie.create({
    data: {
      title: "Superbad",
      description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
      thumbnailUrl: "/images/superbad.jpg", // Copo vermelho clássico
      videoUrl: VIDEOS.BUNNY,
      duration: "1h 53m",
      rating: 7.6,
      releaseYear: 2007,
      tags: { connect: [{ id: comedyTag.id }] }
    }
  });

  // WAR FOR THE PLANET OF THE APES (ANTIGO HANGOVER) 
  // [CORRIGIDO - Atualizado Título e Imagem para combinar com o que aparecia]
  await prisma.movie.create({
    data: {
      title: "War for the Planet of the Apes",
      description: "After the apes suffer unimaginable losses, Caesar wrestles with his darker instincts and begins his own mythic quest to avenge his kind.",
      thumbnailUrl: "https://image.tmdb.org/t/p/original/ulMscezy9YX0bhknvJbZoUgQxO5.jpg", // Imagem de Gorila Real
      videoUrl: VIDEOS.TEARS,
      duration: "2h 20m",
      rating: 7.4,
      releaseYear: 2017,
      tags: { connect: [{ id: actionTag.id }, { id: scifiTag.id }] } // Mudei Tags para Ação/SciFi
    }
  });

  // SPIRITED AWAY [CORRIGIDO - Link TMDB quebrado -> Wikimedia]
  await prisma.movie.create({
    data: {
      title: "Spirited Away",
      description: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had.",
      thumbnailUrl: "/images/spirited-away.jpg", 
      videoUrl: VIDEOS.SINTEL,
      duration: "2h 5m",
      rating: 8.6,
      releaseYear: 2001,
      tags: { connect: [{ id: animeTag.id }, { id: dramaTag.id }] }
    }
  });

  // YOUR NAME [MANTIDO - Você disse que funciona]
  await prisma.movie.create({
    data: {
      title: "Your Name",
      description: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
      thumbnailUrl: "https://image.tmdb.org/t/p/original/q719jXXEzOoYaps6babgKnONONX.jpg",
      videoUrl: VIDEOS.SINTEL,
      duration: "1h 52m",
      rating: 8.4,
      releaseYear: 2016,
      tags: { connect: [{ id: animeTag.id }, { id: dramaTag.id }] }
    }
  });

  // THE GODFATHER [MANTIDO - Você disse que funciona]
  await prisma.movie.create({
    data: {
      title: "The Godfather",
      description: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
      thumbnailUrl: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      videoUrl: VIDEOS.ELEPHANT,
      duration: "2h 55m",
      rating: 9.2,
      releaseYear: 1972,
      tags: { connect: [{ id: dramaTag.id }] }
    }
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