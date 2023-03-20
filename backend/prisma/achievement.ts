import { Achievement, Prisma } from '@prisma/client';
import { prisma } from './seed';

export async function insert_achievement() {
  console.log('Creation achievement');
  const achievements: Prisma.AchievementCreateInput[] = [
    {
      Name: 'Welcome',
      Title: 'First Login',
      Description: "Login for the first time",
    },
    {
      Name: 'Newbie',
      Title: 'First Game',
      Description: 'Play for the first time',
    },
    {
      Name: 'Player',
      Title: 'Play 10 Games',
      Description: 'Play 10 games',
    },
    {
      Name: 'Challenger',
      Title: 'Play 42 Games',
      Description: 'Play 42 games',
    },
    {
      Name: 'Red',
      Title: 'Win One Game',
      Description: 'Win for the first time',
    },
    {
      Name: 'Master',
      Title: 'Win 10 Games',
      Description: 'Win 10 games',
    },
    {
      Name: 'Super Saiyan',
      Title: 'Win 42 Games',
      Description: 'Win 42 games',
    },
    {
      Name: 'Custom',
      Title: 'Change Avatar',
      Description: 'Change avatar',
    },
    {
      Name: 'Mode User',
      Title: 'use 2 different game modes',
      Description: 'Play 2 different game modes',
    }, // MEMO Not sur to keep it
    {
      Name: 'Friend Of Maurice',
      Title: 'Get One Friend',
      Description: 'Get at least one friend',
    },
    {
      Name: 'Super Popstar',
      Title: 'More Friends',
      Description: 'Get 42 friends',
    },
    {
      Name: 'I See U',
      Title: 'Be Admin',
      Description: 'The dark side is not for everyone',
    }, // Give only if with the request
    {
      Name: 'Collector',
      Title: 'Achievements everywhere',
      Description: 'Get 10 achievements',
    },
    {
      Name: "I'm your Father",
      Title: 'Achievements everywhere * 2',
      Description: 'Get all achievements',
    },
    // {Name : "", Title : "", Description : ""},
  ];

  for (let i = 0; i < achievements.length; i++) {
    const achievement: Achievement = await prisma.achievement.create({
      data: achievements[i],
    });
    console.log(
      `Achievement ${achievement.Name} create at id: ${achievement.id} `,
    );
  }
}
