import { User } from '../../../types/User'
import { Socket } from 'socket.io-client';

  // When clicking on the 'ban' button to ban/unban a user
  export const onBanClick = async(
        socket: Socket, roomName: string | undefined,
        userId: number, target: number, off: boolean
    ) => {
    await socket.emit('banUser', {
      roomName: roomName,
      userId: userId,
      target: target,
      off: off,
    })
  }

  // When clicking on the 'kick' button to kick a user
  export const onKickClick = async(
    socket: Socket, roomName: string | undefined, userId: number, target: number
    ) => {
    await socket.emit('kickUser', {
      roomName: roomName,
      userId: userId,
      target: target
    })
  }

  // When clicking on the 'oper' button to make a user oper
  export const onMakeAdminClick = async(
    socket: Socket, roomName: string | undefined, userId: number, target: number, off: boolean
    ) => {
    await socket.emit('toggleMemberMode', {
		roomName: roomName,
		userId: userId,
		target: target,
		mode: 'admin',
		off: off,
	})
  }

  // When clicking on the 'mute' button to mute/unmute a user
  export const onMuteClick = async(
    socket: Socket, roomName: string | undefined, userId: number, target: number, off: boolean
    ) => {
    await socket.emit('toggleMemberMode', {
      roomName: roomName,
      userId: userId,
      target: target,
	  mode: 'mute',
      off: off,
    })
  }

  // When clicking on the 'message' button to send a private
  // message to the user
  export const onPrivMessageClick = async(
    socket: Socket, user: User, user2Id: number, user2Nick: string) => {
    await socket.emit('createChatRoom', {
      room: {
        name: '#' + user.nickname + '/' + user2Nick,
        owner: user.id,
        modes: '',
        password: '',
        userLimit: 2,
        members: {},
        messages: [],
		bannedUsers: [],
	},
    user1: user,
    avatar: user.avatar,
    user2Id: user2Id,
    user2Nick: user2Nick,
    });
  }