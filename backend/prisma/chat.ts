import {Prisma} from '@prisma/client';
import {prisma} from './seed';

export async function insert_General() {
  console.log('Creation chan General');
  const General: Prisma.ChatRoomCreateInput = {
      name: 'General',
      owner: 1, 
      modes: '',
      password: '',
      userLimit: 0,
  };
  await prisma.chatRoom.create({
    data: General,
  });
  console.log(`Chat ${General.name}`);
}