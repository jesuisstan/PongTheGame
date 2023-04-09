import { useContext } from 'react';
import { MemberType } from "../../../types/chat";
import { User } from "../../../types/User";

export const isMuted = (members: MemberType[], userId: number): boolean => {
    for (let i=0; i < members.length; ++i)
        if (members[i].memberId === userId && members[i].modes.indexOf('m') !== -1)
            return true;
    return false;
}

export const checkIfBanned = (bannedMembers: User[], userId: number): boolean => {
    for (const bannedUser in bannedMembers)
        if (bannedMembers[bannedUser].id === userId)
            return true;
    return false;
}

export const isUserBlocked = (user: User, userId: number): boolean => {
    for (const blockedUser in user.blockedUsers)
        if (user.blockedUsers[userId])
            return true;
    return false;
}

export const checkIfOwner = (owner: number | undefined, userId: number): boolean => {
    return owner === userId ? true : false;
}

export const checkIfAdmin = (members: MemberType[], userId: number): boolean => {
    for (const member in members)
        if (members[member].modes.indexOf('a') !== -1)
            return true;
    return false;
}

export const checkPrivileges = (
        owner: number | undefined, userId: number, members: MemberType[], target: number
    ): boolean => {
    // If target is the owner, we stop here: cannot do anything against owners
    if (target === owner) return false;
    // Look for the user asking for privilege
    for (let i=0; i < members.length; ++i) {
        if (members[i].memberId === userId) {
        // If user is neither owner or admin, we stop here
        if (userId !== owner && members[i].modes.indexOf('a') !== -1)
            return false
        // Otherwise, there is no reason not to give privilege
        return true;
        }
    }
    return false;
}