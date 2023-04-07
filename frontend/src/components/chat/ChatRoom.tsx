import { SetStateAction, useContext, useEffect, useState } from 'react';
import { WebSocketContext, socket } from '../../contexts/WebsocketContext';
import {
	Send, Delete, ArrowBackIosNew, Settings,PersonAddAlt, Password,
	ExitToApp, Mail, Clear, PanTool, PersonAdd, VolumeUp, VolumeOff, Room, Block, HighlightOff, AdminPanelSettings, DeveloperMode, PeopleAlt
	} from '@mui/icons-material';
import {
	Box, Button, Divider, FormControl, Grid, IconButton, Stack,
	Menu, MenuItem,TextField, Typography, CircularProgress,
	AvatarGroup, FormGroup, FormControlLabel, Switch, Drawer
			} from '@mui/material';

// personal components
import { UserContext } from '../../contexts/UserContext';
import { MemberType, Message } from "../../types/chat";
import timeFromNow from './utils/timeFromNow';
import AvatarBadge from './utils/AvatarBadge';

// personal css
import './Chat.css';
import MemberList from './utils/MemberList';

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
	// Array including all message objects (author + msg) excluding
	// messages from blocked users/users who blocked the user
	const [messages, setMessages] = useState<Message[]>([])
	// Display typing state of the user
	const [typingDisplay, setTypingDisplay] = useState<string>('')
	// Message input field value
	const [messageText, setMessageText] = useState<string>('')
	// Checks if the user is oper(=admin) in the chat room
	const [isOper, setIsOper] = useState<boolean>(false)
	// Checks if the user is muted in the chat room
	const [isMuted, setIsMuted] = useState<boolean>(false)
	// Array including all members
	const [members, setMembers] = useState<MemberType[]>([])
	// Modify password
	const [oldPassword, setOldPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');


	socket.emit('findAllMembers', { roomName: user.joinedChatRoom },
		(response: MemberType[]) => {
			setMembers(response)
		}
	)
	// Get all messages from messages array in chat.service
	// and fill the messages variable
	socket.emit('findAllMessages',
		{ roomName: user.joinedChatRoom },
		(response: Message[]) => {
			// Array including all the messages, even the ones from
			// blocked users/users who blocked the user
			const messagesToFilter = response

			for (let i = messagesToFilter.length - 1; i >= 0; --i) {
				// First we filter the recipient's blocked users
				let found = false;
				for (const blockedUser in user.blockedUsers) {
					if (messagesToFilter[i].author.nickname === user.blockedUsers[blockedUser])
					{
						messagesToFilter.splice(i, 1);
						found = true;
						break;
					}
				}
				// Then we filter the sender's blocked users
				if (found === false) {
					for (const blockedUser in messagesToFilter[i].author.blockedUsers) {
						if (user.nickname === messagesToFilter[i].author.blockedUsers[blockedUser])
						{
							messagesToFilter.splice(i, 1);
							break;
						}
					}
				}
			}
			const filteredMessages = messagesToFilter
			setMessages(filteredMessages)
		})

	socket.emit('isUserOper',
		{ roomName: user.joinedChatRoom, nick: user.nickname },
		(response: boolean) => {
			setIsOper(response)
		}
	)

	socket.emit('isUserMuted',
	{ roomName: user.joinedChatRoom, nick: user.nickname },
	(response: boolean) => {
		setIsMuted(response)
		}
	)

	/*************************************************************
	 * Event listeners
	 **************************************************************/
	useEffect(() => {
		// Activate listeners and subscribe to events as the component is mounted
		socket.on('connect', () => console.log('connected to websocket!'))
		socket.on(
			'createMessage',
			() => console.log('createMessage event received!')
		)
		socket.on('typingMessage', (
				roomName: string, nick: string, isTyping: boolean) => {
			roomName === user.joinedChatRoom && isTyping ?
				setTypingDisplay(nick + ' is typing...')
				: setTypingDisplay('')
		})
		socket.on('changePassword', (roomName: string, isDeleted: boolean) => {
			if (roomName === user.joinedChatRoom) {
				const status = isDeleted ? 'deleted' : 'modified';
				console.log('Password from ' + roomName + ' has been ' + isDeleted);
			}
		})
		socket.on('makeOper', (roomName: string, target: string) => {
			if (roomName === user.joinedChatRoom)
				console.log(target + ' is Oper now!')
		})
		socket.on('joinRoom', (roomName: string, nick: string) => {
			if (roomName === user.joinedChatRoom)
				console.log(nick + ' joined chatroom [' + roomName + ']');
		});
		socket.on('quitRoom', (roomName: string, nick: string) => {
			if (roomName === user.joinedChatRoom)
				console.log(nick + ' quit room [' + roomName + ']')
		});
		socket.on('kickUser', (roomName: string, target: string) => {
			if (roomName === user.joinedChatRoom)
				console.log(target + ' has been kicked!')
			if (target === user.nickname) props.cleanRoomLoginData()
		});
			socket.on('banUser', (roomName: string, target: string) => {
			if (roomName === user.joinedChatRoom)
				console.log(target + ' has been banned!')
			if (target === user.nickname) props.cleanRoomLoginData()
		})
		socket.on('unBanUser', (roomName: string, target: string) => {
			if (roomName === user.joinedChatRoom)
				console.log(target + ' has been unbanned!')
		})
		socket.on('muteUser', (roomName: string, target: string) => {
			if (roomName === user.joinedChatRoom)
				console.log(target + ' has been muted!')
			if (target === user.nickname) props.cleanRoomLoginData()
		})
		socket.on('unMuteUser', (roomName: string, target: string) => {
			if (roomName === user.joinedChatRoom)
				console.log(target + ' has been unmuted!')
		})

		// Clean listeners to unsubscribe all callbacks for these events
		// before the component is unmounted
		return () => {
			socket.off('connect')
			socket.off('createMessage')
			socket.off('typingMessage')
			socket.off('makeOper')
			socket.off('joinRoom')
			socket.off('quitRoom')
			socket.off('kickUser')
			socket.off('banUser')
			socket.off('unBanUser')
		}
	}, [])

	// Emit that user is typing, or not typing after timeout
	let timeout;
	const emitTyping = () => {
		socket.emit('typingMessage', {
			roomName: user.joinedChatRoom,
			nick: user.nickname,
			isTyping: true
		});
		timeout = setTimeout(() => {
			socket.emit('typingMessage', {
				roomName: user.joinedChatRoom,
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
	const onFormSubmit = (e: any) => {
		e.preventDefault();
		if (messageText)
			socket.emit('createMessage', {
				roomName: user.joinedChatRoom,
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
	const onReturnClick = () => {
		socket.emit('quitRoom', {
			roomName: user.joinedChatRoom,
			nick: user.nickname
		})
		props.cleanRoomLoginData()
	}

	// const checkIfBlocked = (target: string) => {
	//   for (const blockedUser in user.blockedUsers)
	//     if (target === user.blockedUsers[blockedUser])
	//       return true
	//   return false
	// }

	// When clicking on the 'block' button to block a user
	const onBlockClick = (target: string) => {
		user.blockedUsers.push(target)
	}
	// When clicking on the 'unblock' button to unblock a user
	const onUnBlockClick = (target: string) => {
		for (var i=0; i < user.blockedUsers.length; ++i)
			if (user.blockedUsers[i] === target)
			{
				user.blockedUsers.splice(i, 1)
				break;
			}
	}

	// When clicking on the 'ban' button to ban a user
	const onBanClick = (target: string) => {
		socket.emit('banUser', {
			roomName: user.joinedChatRoom,
			nick: user.nickname,
			target: target
		})
	}
	// When clicking on the 'unban' button to unban a user
	const onUnBanClick = (target: string) => {
		socket.emit('unBanUser', {
			roomName: user.joinedChatRoom,
			nick: user.nickname,
			target: target
		})
	}

	const isUserBanned = (nick: string) => {
		socket.emit('isUserBanned', {
			roomName: user.joinedChatRoom,
			nick: nick
		}, (response: boolean) => {
			return response
		})
	}
	
	// When clicking on the 'kick' button to kick a user
	const onKickClick = (target: string) => {
		socket.emit('kickUser', {
			roomName: user.joinedChatRoom,
			nick: user.nickname,
			target: target
		})
	}

	// When clicking on the 'oper' button to make a user oper
	const onMakeOperClick = (target: string) => {
		socket.emit('makeOper', {
			roomName: user.joinedChatRoom,
			nick: user.nickname,
			target: target
		})
	}

	// When clicking on the 'mute' button to mute a user
	const onMuteUserClick = (target: string) => {
		socket.emit('muteUser', {
			roomName: user.joinedChatRoom,
			nick: user.nickname,
			target: target,
			mute: true
		})
	}

	// When clicking on the 'unmute' button to unmute a user
	const onUnMuteUserClick = (target: string) => {
		socket.emit('muteUser', {
			roomName: user.joinedChatRoom,
			nick: user.nickname,
			target: target,
			mute: false
		})
	}

	// When clicking on the 'message' button to send a private
	// message to the user
	const onPrivMessageClick = (user2: string) => {
		socket.emit('createChatRoom', {
			room: {
				name: '#' + user.nickname + '/' + user2,
				modes: '',
				password: '',
				userLimit: 2,
				users: {},
				messages: [],
				bannedNicks: []
			},
			nick: user.nickname,
			user2: user2,
			avatar: user.avatar,
		});
	}

	socket.emit('isUserMuted',
	{ roomName: user.joinedChatRoom, nick: user.nickname },
	(response: boolean) => {
		setIsMuted(response)
		}
	)

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);
	const [openList, setOpenList] = useState(false);

	const handleListClick = () => {
		setOpenList(!openList);
	};

	const handleListClose = () => {
		setOpenList(false);
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		// onReturnClick();
	};

	const handleChangePwd = (deletePwd: boolean) => {
		socket.emit('changePassword', {
			roomName: user.joinedChatRoom,
			currentPassword: oldPassword,
			newPassword: deletePwd ? '' : newPassword,
		});
	};

	const handleAClick = (event: any) => {
		setAnchorAvatar(event.currentTarget);
	};

	const handleAClose = () => {
		setAnchorAvatar(null);
	};

	const isUserBlocked = (usr: any) => {
		for (const blockedUser in user.blockedUsers) {
				if (user.blockedUsers[usr.nickname])
						return true;
		return false;
	}}

	const [isUserBan, setIsUserBan] = useState<boolean>(false);
	
	const isBan = (user: any) => {
		socket.emit('isUserBanned', { roomName: user.joinedChatRoom, nick: user.nickname },
		(response: boolean) => {
			setIsUserBan(response)
		}
		)
	}
	
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
						<Typography sx={{ minWidth: 100 }}>Lets chat here ! {user.joinedChatRoom}</Typography>
						<div style={{ display: 'flex', flexDirection: 'row'}}>
							<MemberList members={members}/>
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
						</div>
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
							{ user.nickname === msg.author.nickname 
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
											onClick={handleAClick}>
											<AvatarBadge
												nickname={msg.author.nickname}
												online={true}/* catch isOnline*/
												// playing={}/* catch isPlaying*/
												admin={false}/* catch isAdmin*/
												oper={true}/* catch isOper*/
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
													onClick={isMuted 
													? () => onMuteUserClick(msg.author.nickname)
													: () => onUnMuteUserClick(msg.author.nickname)}>{/* catch makeUsrMute / makeUsrUnMute*/}
													{isMuted ? <VolumeOff className='black'/> : <VolumeUp className='black'/>}{/* catch isMute*/}
													<span>mute</span>
												</IconButton>
												<IconButton
													onClick={() => onPrivMessageClick(msg.author.nickname) } >{/* catch makePrivateMsg*/}
													<Mail className='black'/>
													<span>private msg</span>
												</IconButton>
												<IconButton
													onClick={ () => onUnBlockClick(msg.author.nickname) } >{/* catch makeBlock / makeUnBlock*/}
													<PanTool className={'black'}/>{/* catch isBlock*/}
													<span>block</span>
												</IconButton>
												{/* catch isAdmin or isOper*/}
												{isOper ?
												<>
													<IconButton
														onClick={() => onKickClick(msg.author.nickname)} >{/* catch makekick*/}
														<Block className='black'/>
														<span>kick</span>
													</IconButton>
													<IconButton
														onClick={() => onBanClick(msg.author.nickname)}>{/* catch makeBan / makeUnBan*/}
														<HighlightOff className='black'/>{/* catch isBan*/}
														<span>ban</span>
													</IconButton>
													<IconButton
														onClick={() => onMakeOperClick(msg.author.nickname)}>{/* catch makeAdmin*/}
														<DeveloperMode className="black"/>{/* catch isAdmin os isOper*/}
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
