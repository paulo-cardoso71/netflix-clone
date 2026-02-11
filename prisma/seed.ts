import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up
  await prisma.myList.deleteMany();
  await prisma.like.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Database cleaned');

  // Create Tags (Genres)
  const actionTag = await prisma.tag.create({ data: { name: 'Action' } });
  const comedyTag = await prisma.tag.create({ data: { name: 'Comedy' } });
  const dramaTag = await prisma.tag.create({ data: { name: 'Drama' } });
  const scifiTag = await prisma.tag.create({ data: { name: 'Sci-Fi' } });
  const animeTag = await prisma.tag.create({ data: { name: 'Anime' } });

  console.log('🏷️ Tags created');


  // --- HERO MOVIE (Big Buck Bunny) ---
  await prisma.movie.create({
    data: {
      title: 'Big Buck Bunny',
      description: 'A giant rabbit with a heart bigger than himself. Watch as he seeks revenge on the bullying rodents in this open-source classic.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
      videoUrl: "aqz-KE-bpKQ",
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
      videoUrl: "eRsGyueVLvQ",
      duration: '15 min', 
      rating: 8.8,
      releaseYear: 2010,
      tags: { connect: [{ id: actionTag.id }, { id: dramaTag.id }] },
    }
  });

  // --- MOVIE (Tears of Steel) ---
  await prisma.movie.create({
    data: {
      title: 'Tears of Steel',
      description: 'In a future where humanity is haunted by robots, a group of scientists attempts to save the world from the apocalypse.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tos-poster.png/640px-Tos-poster.png',
      videoUrl: "R6MlUcmOul8",
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
      videoUrl: "eFQxRd0isAQ",
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
      videoUrl: "Y-rmzh0PI3c",
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
      videoUrl: "lqiN98z6Dak",
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
      videoUrl: "WhWc3b3KhnY",
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
        videoUrl: "mN0zPOpADL4",
        duration: '4 min',
        rating: 7.1,
        releaseYear: 2017,
        tags: { connect: [{ id: actionTag.id }, { id: comedyTag.id }] },
      },
    });

  // ==========================================================
  // PART 2: BLOCKBUSTERS
  // ==========================================================

  // INTERSTELLAR 
  await prisma.movie.create({
    data: {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      thumbnailUrl: "/images/interstellar.webp",
      videoUrl: "zSWdZVtXT7E",
      duration: "2h 49m",
      rating: 9.2,
      releaseYear: 2014,
      tags: { connect: [{ id: scifiTag.id }, { id: dramaTag.id }] }
    }
  });

  // INCEPTION 
  await prisma.movie.create({
    data: {
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      thumbnailUrl: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      videoUrl: "ZszlJQhj4aA",
      duration: "2h 28m",
      rating: 8.8,
      releaseYear: 2010,
      tags: { connect: [{ id: scifiTag.id }, { id: actionTag.id }] }
    }
  });

  // THE DARK KNIGHT
  await prisma.movie.create({
    data: {
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      thumbnailUrl: "/images/dark-knight.webp",
      videoUrl: "vetKTtM7YyU",
      duration: "2h 32m",
      rating: 9.0,
      releaseYear: 2008,
      tags: { connect: [{ id: actionTag.id }, { id: dramaTag.id }] }
    }
  });

  // AVENGERS ENDGAME
  await prisma.movie.create({
    data: {
      title: "Avengers: Endgame",
      description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
      thumbnailUrl: "/images/endgame.webp",
      videoUrl: "TcMBFSGVi1c",
      duration: "3h 1m",
      rating: 8.9,
      releaseYear: 2019,
      tags: { connect: [{ id: actionTag.id }, { id: scifiTag.id }] }
    }
  });

  // SPIDER-MAN 
  await prisma.movie.create({
    data: {
      title: "Spider-Man: Across the Spider-Verse",
      description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
      thumbnailUrl: "/images/spiderverse.webp",
      videoUrl: "cqGjhVJWtEg",
      duration: "2h 20m",
      rating: 9.1,
      releaseYear: 2023,
      tags: { connect: [{ id: actionTag.id }, { id: animeTag.id }] }
    }
  });

  // SUPERBAD 
  await prisma.movie.create({
    data: {
      title: "Superbad",
      description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
      thumbnailUrl: "/images/superbad.webp", // Copo vermelho clássico
      videoUrl: "4eaZ_48ZYog",
      duration: "1h 53m",
      rating: 7.6,
      releaseYear: 2007,
      tags: { connect: [{ id: comedyTag.id }] }
    }
  });

  // WAR FOR THE PLANET OF THE APES 
  await prisma.movie.create({
    data: {
      title: "War for the Planet of the Apes",
      description: "After the apes suffer unimaginable losses, Caesar wrestles with his darker instincts and begins his own mythic quest to avenge his kind.",
      thumbnailUrl: "https://image.tmdb.org/t/p/original/ulMscezy9YX0bhknvJbZoUgQxO5.jpg", 
      videoUrl: "cy8szbRLKJg",
      duration: "2h 20m",
      rating: 7.4,
      releaseYear: 2017,
      tags: { connect: [{ id: actionTag.id }, { id: scifiTag.id }] } 
    }
  });

  // SPIRITED AWAY
  await prisma.movie.create({
    data: {
      title: "Spirited Away",
      description: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had.",
      thumbnailUrl: "/images/spirited-away.webp", 
      videoUrl: "fDUFP7EeXLE",
      duration: "2h 5m",
      rating: 8.6,
      releaseYear: 2001,
      tags: { connect: [{ id: animeTag.id }, { id: dramaTag.id }] }
    }
  });

  // YOUR NAME 
  await prisma.movie.create({
    data: {
      title: "Your Name",
      description: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
      thumbnailUrl: "/images/your-name.webp",
      videoUrl: "VnM0TzdzJOw",
      duration: "1h 52m",
      rating: 8.4,
      releaseYear: 2016,
      tags: { connect: [{ id: animeTag.id }, { id: dramaTag.id }] }
    }
  });

  // THE GODFATHER 
  await prisma.movie.create({
    data: {
      title: "The Godfather",
      description: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
      thumbnailUrl: "/images/godfather.webp",
      videoUrl: "UaVTIH8mujA",
      duration: "2h 55m",
      rating: 9.2,
      releaseYear: 1972,
      tags: { connect: [{ id: dramaTag.id }] }
    }
  });

  await prisma.movie.create({
    data: {
      title: "Wayne",
      description: "Wayne, a 16-year-old Dirty Harry with a heart of gold, sets out on a small two-stroke road bike from Boston to Florida with his new friend Del to get back the shit-hot 79' Trans-Am that was stolen from his father before he died.",
      thumbnailUrl: "/images/wayne.webp",
      videoUrl: "PFOtvHtyW8s",
      duration: "1 Season",
      rating: 8.4,
      releaseYear: 2019,
      tags: { connect: [{ id: actionTag.id }, { id: comedyTag.id }] }, // Conecta nas tags de Ação/Comédia
      
      episodes: {
        create: [
          {
            title: "Chapter 1: Get Some Then",
            description: "Wayne sets out to retrieve his late father's stolen 1979 Pontiac Trans Am.",
            duration: "33m",
            videoUrl: "p84O3JAp_IM", 
            thumbnailUrl: "/images/wayne1.webp"
          },
          {
            title: "Chapter 2: No Priests",
            description: "Wayne and Del are officially on the road, but they're not exactly bonding properly yet.",
            duration: "30m",
            videoUrl: "E-rm94HjuDw", 
            thumbnailUrl: "/images/wayne2.webp"
          },
          {
            title: "Chapter 3: The Goddamned Beacon of Truth",
            description: "The pair runs into some trouble with locals as they cross state lines.",
            duration: "29m",
            videoUrl: "LDS2zCKrczs", 
            thumbnailUrl: "/images/wayne3.webp" 
          }
        ]
      }
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