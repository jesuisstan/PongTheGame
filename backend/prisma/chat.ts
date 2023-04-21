import { Prisma } from '@prisma/client';
import { prisma } from './seed';
import * as bcrypt from 'bcrypt';

export async function insert_General() {
  const generateHash = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  console.log('Creation chan General');
  const General: Prisma.ChatRoomCreateInput = {
    name: 'General',
    owner: 1,
    modes: '',
    password: '',
    userLimit: 0,
  };
  const VIP: Prisma.ChatRoomCreateInput = {
    name: 'VIP',
    owner: 1,
    modes: 'p',
    password: generateHash('TopSecret'),
    userLimit: 0,
  };
  await prisma.chatRoom.create({
    data: General,
  });
  await prisma.chatRoom.create({
    data: VIP,
  });
  console.log(`Chat ${General.name}`);
  console.log(`Chat ${VIP.name}`);
}
