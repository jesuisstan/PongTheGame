import { SetStateAction, useContext, useEffect, useState } from 'react';
import { WebSocketContext, socket } from '../../contexts/WebsocketContext';
import {
	Send, Delete, ArrowBackIosNew, Settings,PersonAddAlt, Password,
	ExitToApp, Mail, Clear, PanTool, PersonAdd, VolumeUp, VolumeOff, Room, Block, HighlightOff, AdminPanelSettings, DeveloperMode
	} from '@mui/icons-material';
import {
	Box, Button, Divider, FormControl, Grid, IconButton, Stack,
	Menu, MenuItem,TextField, Typography, CircularProgress,
	AvatarGroup, FormGroup, FormControlLabel, Switch, Popper
			} from '@mui/material';

// personal components
import { UserContext } from '../../contexts/UserContext';
import { MemberType, Message } from "../../types/chat";
import timeFromNow from './utils/timeFromNow';
import AvatarBadge from './utils/AvatarBadge';

// personal css
import './Chat.css';
import { User } from '../../types/User';

/*************************************************************
 * Chat room
 
 * Represents each created chat room 
**************************************************************/

const ChatRoom = (props: any) => {
	/*************************************************************
	 * States
	**************************************************************/
	const socket = useContext(WebSocketContext)
	const { user, setUser } = useContext(UserContext)
	// Array including all members
	const [members, setMembers] = useState<MemberType[]>(props.room.members)
	// Array including all the banned users from the room
	const [bannedMembers, setBannedMembers] = useState<User[]>(props.room.bannedMembers)
	// Array including all message objects (author + msg) excluding
	// messages from blocked users/users who blocked the user
	const [messages, setMessages] = useState<Message[]>([])
	// Display typing state of the user
	const [typingDisplay, setTypingDisplay] = useState<string>('')
	// Message input field value
	const [messageText, setMessageText] = useState<string>('')
	// Modify password
	const [oldPassword, setOldPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	// Checks if the target user is banned from the room
	const [isBanned, setIsBanned] = useState<Boolean>(false)


	/*************************************************************
	* State getters
	*
	* We keep fetching the data to get all the updates
	**************************************************************/

  	const findAllMembers = async() => {
	await socket.emit('findAllMembers', { roomName: props.room.name },
		(response: MemberType[]) => {
		setMembers(response)
		}
	)}
	findAllMembers();

	const findAllBanned = async() => {
		await socket.emit('findAllBannedMembers', { roomName: props.room.name },
		(response: User[]) => {
			setBannedMembers(response)
		})
	}
	findAllBanned();

	// Get all messages from messages array in chat.service
	// and fill the messages variable
	const findAllMessages = async() => {
	await socket.emit('findAllMessages',
	{ roomName: props.room.name },
	(response: Message[]) => {
		// Array including all the messages, even the ones from
		// blocked users/users who blocked the user
		const messagesToFilter = response
		for (let i = messagesToFilter.length - 1; i >= 0; --i) {
		// First we filter the recipient's blocked users
		let found = false;
		for (const blockedUser in user.blockedUsers) {
			if (messagesToFilter[i].author.id === user.blockedUsers[blockedUser])
			{
			messagesToFilter.splice(i, 1);
			found = true;
			break;
			}
		}
		// Then we filter the sender's blocked users
		if (found === false) {
			for (const blockedUser in messagesToFilter[i].author.blockedUsers) {
			if (user.id === messagesToFilter[i].author.blockedUsers[blockedUser])
			{
				messagesToFilter.splice(i, 1);
				break;
			}
			}
		}
		}
		const filteredMessages = messagesToFilter
		setMessages(filteredMessages)
	})}
	findAllMessages();


	/*************************************************************
	* Event listeners
	**************************************************************/
  	useEffect(() => {
    // Activate listeners and subscribe to events as the component is mounted
    socket.on('typingMessage', (
        roomName: string, nick: string, isTyping: boolean) => {
      roomName === props.room.name && isTyping ?
        setTypingDisplay(nick + ' is typing...')
        : setTypingDisplay('')
    })
    socket.on('changePassword', (roomName: string, isDeleted: boolean) => {
      if (roomName === props.room.name) {
        const status = isDeleted ? 'deleted' : 'modified';
        console.log('Password from ' + roomName + ' has been ' + isDeleted);
      }
    })
    socket.on('joinRoom', (roomName: string, userId: number) => {
      if (roomName === props.room.name)
		  console.log('user ID: ' + userId + ' joined chatroom [' + roomName + ']');
    });
    socket.on('quitRoom', (roomName: string, userId: number) => {
      if (userId === user.id && roomName === props.room.name) {
		props.cleanRoomLoginData()
        console.log('user ID: ' + userId + ' quit room [' + roomName + ']')
	  }
    });
    socket.on('kickUser', (roomName: string, target: number) => {
      if (roomName === props.room.name)
        console.log(target + ' has been kicked!')
      if (target === user.id) props.cleanRoomLoginData()
    });
	// User has made admin
    socket.on('adminUser', (roomName: string, target: number) => {
		if (roomName === props.room.name)
			console.log(target + ' is admin now!')
	})
	// User is not admin anymore
	socket.on('unadminUser', (roomName: string, target: number) => {
		if (roomName === props.room.name)
			console.log('user ID: ' + target + ' is not admin anymore now!')
	})
      socket.on('banUser', (roomName: string, target: number) => {
      if (roomName === props.room.name)
        console.log(target + ' has been banned!')
      if (target === user.id) props.cleanRoomLoginData()
    })
    socket.on('unbanUser', (roomName: string, target: number) => {
      if (roomName === props.room.name)
        console.log(target + ' has been unbanned!')
    })
    socket.on('muteUser', (roomName: string, target: number) => {
      if (roomName === props.room.name)
        console.log(target + ' has been muted!')
    })
    socket.on('unmuteUser', (roomName: string, target: number) => {
      if (roomName === props.room.name)
        console.log(target + ' has been unmuted!')
    })

    // Clean listeners to unsubscribe all callbacks for these events
    // before the component is unmounted
    return () => {
		socket.off('createMessage')
		socket.off('typingMessage')
		socket.off('changePassword')
		socket.off('joinRoom')
		socket.off('quitRoom')
		socket.off('kickUser')
		socket.off('adminUser')
		socket.off('unadminUser')
		socket.off('banUser')
		socket.off('unbanUser')
		socket.off('muteUser')
		socket.off('unmuteUser')
    }
  }, [])


	/*************************************************************
	* Status getters
	**************************************************************/

	const isMuted = (userId: number) => {
		for (let i=0; i < members.length; ++i)
			if (members[i].memberId === userId && members[i].modes.indexOf('m') !== -1)
				return true;
		return false;
	}
	
	const checkIfBanned = (userId: number) => {
		for (const bannedUser in bannedMembers)
			if (bannedMembers[bannedUser].id === userId)
				return true;
		return false;
	}

	const isUserBlocked = (userId: number) => {
		for (const blockedUser in user.blockedUsers) {
			if (user.blockedUsers[userId])
				return true;
		return false;
	}}

	const checkIfOwner = (userId: number) => {
		return props.room.owner === userId ? true : false;
	}

	const checkIfAdmin = (userId: number) => {
		for (const member in members)
			if (members[member].modes.indexOf('a') !== -1)
				return true;
		return false;
	}

	const checkPrivileges = (target: number) => {
		// If target is the owner, we stop here: cannot do anything against owners
		if (target === props.room.owner) return;
		// Look for the user asking for privilege
		for (let i=0; i < members.length; ++i) {
			if (members[i].memberId === user.id) {
			// If user is neither owner or admin, we stop here
			if (user.id !== props.room.owner && members[i].modes.indexOf('a') !== -1)
				return false
			// Otherwise, there is no reason not to give privilege
			return true;
			}
		}
		return false;
	}


  	/*************************************************************
	* Events
	**************************************************************/

  // Emit that user is typing, or not typing after timeout
  let timeout;
  const emitTyping = () => {
    socket.emit('typingMessage', {
      roomName: props.room.name, 
      nick: user.nickname,
      isTyping: true
    });
    timeout = setTimeout(() => {
      socket.emit('typingMessage', {
        roomName: props.room.name,
		nick: user.nickname,
        isTyping: false
      });
    }, 2000);
  };

	// Activated whenever the user is typing on the message input field
	const onTyping = (msg: string) => {
		emitTyping();
		setMessageText(msg);
	};

	// On submit, send the nickName with the written message from the input field
	// to the backend, as a createMessage event
	const onFormSubmit = async(e: any) => {
		e.preventDefault();
		if (messageText)
			await socket.emit('createMessage', {
				roomName: props.room.name,
				message: {
					author: user,
					data: messageText,
					timestamp: new Date()
				}
			});
		// Reset input field value once sent
		setMessageText('');
	};

  // When clicking on the 'return' button
  const onReturnClick = async() => {
    await socket.emit('quitRoom', {
      roomName: props.room.name,
      userId: user.id,
    })
    props.cleanRoomLoginData()
  }

  // const checkIfBlocked = (target: number) => {
  //   for (const blockedUser in user.blockedUsers)
  //     if (target === user.blockedUsers[blockedUser])
  //       return true
  //   return false
  // }

  // When clicking on the 'block' button to block a user
  const onBlockClick = async(target: number) => {
	if (user.id !== target) {
		// Check if target is not already blocked
		for (let i=0; i < user.blockedUsers.length; ++i)
			if (user.blockedUsers[i] === target) return
		user.blockedUsers.push(target)
		await socket.emit('saveBlockedUserToDB', {
			user: user,
			blockedUsers: user.blockedUsers
		})
		console.log("You've blocked " + target + "!")
	}
  }

  // When clicking on the 'unblock' button to unblock a user
  const onUnBlockClick = async(target: number) => {
    for (var i=0; i < user.blockedUsers.length; ++i)
      if (user.blockedUsers[i] === target)
      {
        user.blockedUsers.splice(i, 1)
		user.blockedUsers.push(target)
		await socket.emit('saveBlockedUserToDB', {
			user: user,
			blockedUsers: user.blockedUsers
		})
        break;
      }
  }

  // When clicking on the 'ban' button to ban/unban a user
  const onBanClick = (target: number, off: boolean) => {
	socket.emit('banUser', {
		roomName: props.room.name,
		userId: user.id,
		target: target,
		off: off,
	})
  }

  // When clicking on the 'kick' button to kick a user
  const onKickClick = async(target: number) => {
    await socket.emit('kickUser', {
      roomName: props.room.name,
      userId: user.id,
      target: target
    })
  }

  // When clicking on the 'oper' button to make a user oper
  const onMakeAdminClick = (target: number, off: boolean) => {
    socket.emit('toggleMemberMode', {
		roomName: props.room.name,
		userId: user.id,
		target: target,
		mode: 'admin',
		off: off,
	})
  }

  // When clicking on the 'mute' button to mute/unmute a user
  const onMuteClick = (target: number, off: boolean) => {
    socket.emit('toggleMemberMode', {
      roomName: props.room.name,
      userId: user.id,
      target: target,
	  mode: 'mute',
      off: off,
    })
  }

  // When clicking on the 'message' button to send a private
  // message to the user
  const onPrivMessageClick = (user2: User) => {
    socket.emit('createChatRoom', {
      room: {
        name: '#' + user.nickname + '/' + user2.nickname, /* TODO change to nick */
		owner: user.id,
		modes: '',
        password: '',
        userLimit: 2,
        members: {},
        messages: [],
		bannedUsers: [],
	},
	user1: user,
	user2: user2,
    });
  }

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		// onReturnClick();
	};

	const handleChangePwd = async(deletePwd: boolean) => {
		await socket.emit('changePassword', {
			roomName: props.room.name,
			currentPassword: oldPassword,
			newPassword: deletePwd ? '' : newPassword,
		});
	};

	const handleAClick = (event: any, userId: number) => {
		setAnchorAvatar(event.currentTarget);
	};

	const handleAClose = () => {
		setAnchorAvatar(null);
	};


	
	/*************************************************************
	 * Render HTML response
	**************************************************************/
	return (
		<div id="chatBox">
			<div>
					<Box className='black' id="chatTitle">
						<IconButton style={{ paddingRight: -1 }} onClick={onReturnClick}>
							<ArrowBackIosNew
								className='black'
								aria-label="return"/>
						</IconButton>        
						<Typography sx={{ minWidth: 100 }}>Lets chat here ! {props.room.name}</Typography>
						<IconButton
							title="Room settings"
							onClick={handleClick}
							size="small"
							sx={{ ml: 2 }}
							aria-controls={Boolean(anchorEl) ? 'basic-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={Boolean(anchorEl) ? 'true' : undefined}>
							<Settings className='black' />
						</IconButton>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
							className='black' >
							<MenuItem onClick={() => handleChangePwd(false)} title="Change Password">
								<Password sx={{ color: 'black' }} />
							</MenuItem>
							<MenuItem onClick={() => handleChangePwd(true)} title="Delete Password">
								<Delete sx={{ color: 'black' }} />
							</MenuItem>
							<MenuItem onClick={onReturnClick} title="Leave Room">
								<ExitToApp className='black' />
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<Clear className='black'/>
								<span>close</span>
							</MenuItem>
						</Menu>
					</Box>
					<Divider />
					<Grid container spacing={3}>
						<Grid sx={{display: 'flex',	flexGrow: '1'}}></Grid>
						<Grid
							item
							id="chat-window"
							xs={12} >
					{ messages.length === 0 
						? <div className='black'>No Message</div>
						: <Stack className='message-area'> {
							messages.map((msg, index) => (
								<div key={index}>
							{ user.id === msg.author.id
								?	<div className="msgRowR">
										<div className='msgRight msgBubble'>
											<p className="msgText">{msg.data}</p>
											<div className="msgTime">{timeFromNow(msg.timestamp)}</div>
										</div>
									</div>
								: 
								// Is msg author mute or blocked ?
								// if yes, display nothing
								// if no, display message
								// !isMuted && !isBlocked ? <></> :
									<div className="msgRowL">
{/*// -------------- Avatar Badge -------------- */}
										<Button
											aria-controls="basic-menu"
											aria-haspopup="true"
											aria-expanded={Boolean(anchorAvatar)}
											onClick={e => handleAClick(e, msg.author.id)}>
											<AvatarBadge
												nickname={msg.author.nickname}
												online={true}/* catch isOnline*/
												// playing={}/* catch isPlaying*/
												admin={checkIfAdmin(msg.author.id)}/* catch isAdmin*/
												oper={checkIfOwner(msg.author.id)}
												avatar={msg.author.avatar}
												look={true}/>
										</Button>
										{user.nickname !== msg.author.nickname
										?	<Menu
												anchorEl={anchorAvatar}
												open={Boolean(anchorAvatar)}
												onClose={handleAClose}
												className='black column-barre' >
												<MenuItem
													aria-label="back" 
													className='column-barre'>{/* catch usrProfil (profil/nickname)*/}
													<IconButton >
													<PersonAdd className='black'/>
													<span>add friend</span>
												</IconButton>
												<IconButton
													onClick={() => onPrivMessageClick(msg.author) } >{/* catch makePrivateMsg*/}
													<Mail className='black'/>
													<span>private msg</span>
												</IconButton>
												<IconButton
													onClick={isUserBlocked(msg.author.id) ?
														() => onUnBlockClick(msg.author.id)
														: () => onBlockClick(msg.author.id)
													} >
													<PanTool className={'black'}/>{/* catch isBlock*/}
													<span>block</span>
												</IconButton>
	
												{checkPrivileges(msg.author.id) ?
												<>
												<IconButton
													onClick={isMuted(msg.author.id)
													? () => onMuteClick(msg.author.id, true)
													: () => onMuteClick(msg.author.id, false)}>
													{isMuted(msg.author.id) ? <VolumeOff className='black'/> : <VolumeUp className='black'/>}{/* catch isMute*/}
													<span>mute</span>
												</IconButton>
													<IconButton
														onClick={() => onKickClick(msg.author.id)} >
														<Block className='black'/>
														<span>kick</span>
													</IconButton>
													<IconButton
														onClick={checkIfBanned(msg.author.id) ?
															() => onBanClick(msg.author.id, true)
															: () => onBanClick(msg.author.id, false)}>
														<HighlightOff className='black'/>
														<span>ban</span>
													</IconButton>
													<IconButton
														onClick={checkIfAdmin(msg.author.id) ?
															() => onMakeAdminClick(msg.author.id, true)
															: () => onMakeAdminClick(msg.author.id, false)}>
														<DeveloperMode className="black"/>
														<span>admin</span>
													</IconButton>
														</> : <></> }
													<IconButton
														onClick={handleAClose}>
														<Clear className='black'/>
														<span>close</span>
													</IconButton>
												</MenuItem>
											</Menu>
											: <></>}
														<div>
											<div className="msgLeft msgBubble">
												<p className="msgText">{msg.data}</p>
												<div className="msgTime">{timeFromNow(msg.timestamp)}</div>
											</div>
										</div>
									</div>}
								</div>
								))}	
							</Stack>
					}
						<Grid item xs={10} className="chat-room-text">
						<div className='typingButton'>
						{	typingDisplay && <div className='black'><CircularProgress color="inherit" />{typingDisplay}</div> }
						</div>
							<FormControl fullWidth onSubmit={onFormSubmit}>
								<TextField
									value={messageText}
									label="Type your message here ..."
									variant="filled" //outlined, filled, standard
									multiline={false}
									onChange={(e: any) => onTyping(e.target.value)}
									onKeyPress={(ev) => {
										if (ev.key === 'Enter') {
											onFormSubmit(ev);
										}
									}}
								/>
							</FormControl>
						</Grid>

						</Grid>
						<Grid sx={{display: 'flex',	flexGrow: '1'}}></Grid>
					</Grid>
		</div>
	</div> );
};

export default ChatRoom;
