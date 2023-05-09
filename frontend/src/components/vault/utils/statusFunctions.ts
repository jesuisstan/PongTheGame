import { User } from '../../../types/User';

export const checkIfBanned = (
  bannedMembers: User[],
  userId: number
): boolean => {
  for (const bannedUser in bannedMembers)
    if (bannedMembers[bannedUser].id === userId) return true;
  return false;
};

export const isUserBlocked = (
  user: User,
  target?: number | null,
  nickname?: string | null
): boolean => {
  var i = 0;
  if (user.blockedUsers && target != null) {
    for (i = 0; i < user.blockedUsers.length; ++i)
      if (user.blockedUsers[i].id === target) return true;
  } else if (nickname != null) {
    // if (user.blockedUsers.find(() => nickname )) return true;
    for (i = 0; i < user.blockedUsers.length; ++i)
      if (user.blockedUsers[i].nickname === nickname) return true;
  }
  return false;
};

export const checkIfOwner = (
  owner: number | undefined,
  userId: number
): boolean => {
  return owner === userId ? true : false;
};
