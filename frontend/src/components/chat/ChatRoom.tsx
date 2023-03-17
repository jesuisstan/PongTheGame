import { SetStateAction, useContext, useEffect, useState } from 'react';
import { WebSocketContext, socket } from '../../contexts/WebsocketContext';
import {
	Send, Delete, ArrowBackIosNew, Settings,PersonAddAlt, Password, ExitToApp, AdminPanelSettingsTwoTone, StarPurple500Rounded, Mail, Clear, PanTool, PersonAdd
			} from '@mui/icons-material';
import {
	Avatar,
	Box, Button, Divider, FormControl, Grid, IconButton, Stack,
	ListItem, Menu, MenuItem,TextField, Typography, CircularProgress, AvatarGroup, Icon, Chip, Badge, FormLabel, FormGroup, FormControlLabel, Switch, ListItemIcon
			} from '@mui/material';

import { UserContext } from '../../contexts/UserContext';
import { MemberType, Message } from "../../types/chat";
import timeFromNow from './utils/GetTime';
import './Chat.css';
import "./bubble.css"




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
						console.log('author: ' + messagesToFilter[i].author.nickname + ' user: ' + user.blockedUsers[blockedUser])

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
				setTypingDisplay(nick )
				: setTypingDisplay('')
		})
		socket.on('changePassword', (roomName: string, isDeleted: boolean) => {
			if (roomName === user.joinedChatRoom) {
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
		});
	}


	const handleUsrClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		onReturnClick();
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
		<>
				
				<>
					<ul>

						{ 
// ------------- List of Member's in room ------------- 
							Object.keys(members).map((nick, index) => (
									<p key={ index }>
										<>

											{ // Nickname of the member preceeded by its online status
												members[nick as any].isOnline ? '*' : '' } { nick }

											{ // Displays if member is oper
												String(members[nick as any].modes).search('o') !== -1 ?
													<Icon><StarPurple500Rounded fontSize='small' color="warning"/></Icon> : '' }

											{ // If user is oper(=admin), the button to users oper is displayed 
												isOper && (user.nickname !== nick) &&
													String(members[nick as any].modes).search('o') === -1 &&
												<button onClick={ () => onMakeOperClick(nick) }>
													oper
												</button>
											}                          
											
											{ // If user is oper(=admin), the button to kick users is displayed 
												isOper && (user.nickname !== nick) &&
													String(members[nick as any].modes).search('o') === -1 &&
												<button onClick={ () => onKickClick(nick) }>
													kick
												</button>
											}
											
											{ // If user is oper(=admin), the button to ban users is displayed 
												isOper && (user.nickname !== nick) &&
													String(members[nick as any].modes).search('o') === -1 &&
												<button onClick={ () => onBanClick(nick) }>
													ban
												</button>
											}
											{ // If user is oper(=admin), the button to unban users is displayed 
												isOper && (user.nickname !== nick) &&
												String(members[nick as any].modes).search('o') === -1 &&
												<button onClick={ () => onUnBanClick(nick) }>
													unban
												</button>
											}
											
											{ // Block button appears if the author of the message
												// is not the user himself
												(user.nickname !== nick) &&
													<button onClick={ () => onBlockClick(nick) }>
														block
													</button>
											}

											{ // Unblock button appears if the author of the message
												// is not the user himself
												(user.nickname !== nick) &&
													<button onClick={ () => onUnBlockClick(nick) }>
														unblock
													</button>
											}
										</>
									</p>
							))
						}
					</ul>
				</>

		<>
			<div>
				<Box>
					<Typography
						gutterBottom
						variant='h6'
						className='black'
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-around',
							alignItems: 'center'
						}}
					>
						<IconButton style={{ paddingRight: -1 }} onClick={onReturnClick}>
							<ArrowBackIosNew
								
								className='black'
								aria-label="return"
							/>
						</IconButton>
						Lets chat here ! #{user.joinedChatRoom}
						<Button
							id="basic-button"
							aria-controls="basic-menu"
							aria-haspopup="true"
							aria-expanded={Boolean(anchorEl)}
							onClick={handleClick}
						>
							<Settings className='black' />
						</Button>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
							className='black' >
							<MenuItem onClick={handleClose} aria-label="add friend">
								<PersonAddAlt className='black' />
							</MenuItem>
							<MenuItem onClick={() => handleChangePwd(false)} aria-label="change password">
								<Password sx={{ color: 'black' }} />
							</MenuItem>
							<MenuItem onClick={() => handleChangePwd(true)} aria-label="delete room">
								<Delete sx={{ color: 'black' }} />
							</MenuItem>
							<MenuItem onClick={handleClose} aria-label="leave room">
								<ExitToApp className='black' />
							</MenuItem>
						</Menu>
					</Typography>
					<Divider />
					<Grid container spacing={3}>
						<Grid
							item
							id="chat-window"
							xs={12}
							sx={{
								width: '100vw'
							}}
						>
							{
// -------------- Begin of display messages --------------
							messages.length === 0 ? 
// -------------- If no message: Display "No Message" --------------
							(	<div className='black'>No Message</div> ) : 
// -------------- If messages: Display messages --------------
							(
							<Stack> {
									messages.map((msg, index) => (
									<div key={index}>
										{
											user.nickname === msg.author.nickname ? (
												<>
													<div className="msgRowR">
															<div className='msgRight'>
																	<p className="msgText">{msg.data}</p>
																	<div className="msgTime">Date</div>
															</div>
													</div>
												</>
											) : (
												<>
													<div className="msgRowL">
													<p>
{/*// -------------- Avatar Clickable -------------- */}
													<Button
														aria-controls="basic-menu"
														aria-haspopup="true"
														aria-expanded={Boolean(anchorAvatar)}
														onClick={handleAClick}
													>
{/*// -------------- Avatar Badge -------------- */}
{/* if is oper Warning R-T <-> if is online success else danger R-B*/}
														<Badge  color="success" overlap='circular' variant='dot' anchorOrigin={{vertical:'bottom', horizontal:'right' }} >
														<Badge	color="warning" overlap='circular' variant='dot' anchorOrigin={{vertical:'top', horizontal:'right' }} >
															<Avatar 
																alt={msg.author.username}
																className="avatar"
																src={msg.author.avatar}
																onClick={handleAClick}></Avatar>
														</Badge>
														</Badge>
													</Button>
{/*// -------------- Avatar Menu -------------- */}
													<Menu
														anchorEl={anchorAvatar}
														open={Boolean(anchorAvatar)}
														onClose={handleAClose}
														className='black' >
{/*// -------------- Menu Icon Part -------------- */}
														<MenuItem aria-label="back">
															<IconButton >
																<PersonAdd className='black'/>
															</IconButton>
															<IconButton onClick={() => onPrivMessageClick(msg.author.username) } >
																<Mail className='black'/>
															</IconButton>
															<IconButton onClick={ () =>
																isUserBlocked(msg.author.username)
																? onUnBlockClick(msg.author.username)
																: onBlockClick(msg.author.username) } >
																<PanTool className={!isUserBlocked(msg.author.username)? 'black': 'white'}/>
															</IconButton>
															<IconButton onClick={handleAClose}>
																<Clear className='black'/>
															</IconButton>
														</MenuItem>
{/*// -------------- Menu Switch Part -------------- */}
														<FormControl component="fieldset">
															<FormGroup aria-label="position" >
																<FormControlLabel
																	value="start"
																	control={<Switch color="error" />}
																	label="Operator"
																	labelPlacement="start"
																	color='error'
																/>
																<FormControlLabel
																	value="start"
																	checked={isUserBan? true : false}
																	control={<Switch color="error" />}
																	label="Ban user"
																	labelPlacement="start"
																	onChange={ 
																		isUserBan
																		? (() => onBanClick(msg.author.nickname)) 
																		: (() => onUnBanClick(msg.author.nickname)) 
																		}
																/>
																<FormControlLabel
																	value="start"
																	control={<Switch color="error" />}
																	label="Block "
																	labelPlacement="start"
																	onChange={
																		isUserBlocked(msg.author.nickname) === false 
																		? (() => onBlockClick(msg.author.nickname))
																		: (() => onUnBlockClick(msg.author.nickname))}
																/>
															</FormGroup>
														</FormControl>
													</Menu>
{/*// -------------- End Avatar / Menu -------------- */}
													</p>							
														<div>
																<div className="nickName">{msg.author.username}</div>
																<div className="msgLeft">
																		<p className="msgText">{msg.data}</p>
																		<div className="msgTime">Date</div>
																</div>
														</div>
													</div>
												</> 
											)
										}
									</div>
								))}</Stack>
							)
// -------------- End of message display ----------------
							}
						</Grid>
						<div className="chatRoomText">
							<div className='typingButton'>

							{
								// Display message to other users if user is currently typing
								typingDisplay && <div className='black'><CircularProgress color="inherit" />{typingDisplay}</div>
							}
							</div>
							<Grid item xs={10}>
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
							<Grid item xs={1}>
								<IconButton
									color="primary"
									aria-label="send"
									onClick={onFormSubmit}
								>
									<Send />
								</IconButton>
							</Grid>
						</div>
					</Grid>
				</Box>
			</div>
		</>

</>

	);
};

export default ChatRoom;
