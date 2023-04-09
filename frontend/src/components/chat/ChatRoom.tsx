import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import {
	Delete, ArrowBackIosNew, Settings, PersonAddAlt, Password,
	ExitToApp, Clear, PersonAdd, VolumeUp, VolumeOff, Room, Block, HighlightOff, AdminPanelSettings, DeveloperMode, Save
	} from '@mui/icons-material';
import {
	Box, Button, Divider, FormControl, Grid, IconButton, Stack,
	Menu, MenuItem,TextField, Typography, CircularProgress, Modal
			} from '@mui/material';

// personal components
import { UserContext } from '../../contexts/UserContext';
import { ChatRoomType, MemberType, Message } from "../../types/chat";
import timeFromNow from './utils/timeFromNow';
import AvatarBadge from './utils/AvatarBadge';

// personal css
import './Chat.css';
import * as MUI from '../UI/MUIstyles';
import { User } from '../../types/User';
import MemberList from './utils/MemberList';
import { ModalClose, ModalDialog } from '@mui/joy';
import { LoadingButton } from '@mui/lab';
import * as statusUtils from './utils/statusFunctions';

/*************************************************************
 * Chat room
 
 * Represents each created chat room 
**************************************************************/

interface ChatRoomProps {
	cleanRoomLoginData: () => void;
	room: ChatRoomType;
}

const ChatRoom = (props: ChatRoomProps) => {
	/*************************************************************
	 * States
	**************************************************************/
	const socket = useContext(WebSocketContext)
	const { user, setUser } = useContext(UserContext)
	// Array including all members
	const [members, setMembers] = useState<MemberType[]>(props.room.members)
	// Array including all the banned users from the room
	const [bannedMembers, setBannedMembers] = useState<User[]>(props.room.bannedUsers)
	// Array including all message objects (author + msg) excluding
	// messages from blocked users/users who blocked the user
	const [messages, setMessages] = useState<Message[]>([])
	// Display typing state of the user
	const [typingDisplay, setTypingDisplay] = useState<string>('')
	// Message input field value
	const [messageText, setMessageText] = useState<string>('')
	// Modify password
	const [isPwdProtected, setIsPwdProtected] = useState<boolean>(false);
	const [oldPassword, setOldPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	// Checks if the target user is banned from the room
	const [isBanned, setIsBanned] = useState<Boolean>(false)


	/*************************************************************
	* State getters
	*
	* We keep fetching the data to get all the updates
	**************************************************************/

  	const findAllMembers = async () => {
	await socket.emit('findAllMembers', { roomName: props.room.name },
		(response: MemberType[]) => {
		setMembers(response)
		}
	)}
	findAllMembers();

	const findAllBanned = async () => {
		await socket.emit('findAllBannedMembers', { roomName: props.room.name },
		(response: User[]) => {
			setBannedMembers(response)
		})
	}
	findAllBanned();

	const isPasswordProtected = async (roomName: string
	) => {
		await socket.emit('isPasswordProtected', { roomName: roomName },
			(response: boolean) => { setIsPwdProtected(response); })
	}
	isPasswordProtected(props.room.name);

	// Get all messages from messages array in chat.service
	// and fill the messages variable
	const findAllMessages = async () => {
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
        console.log('Password from [' + roomName + '] has been ' + status);
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
	const onFormSubmit = async (e: any) => {
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
  const onReturnClick = async () => {
    await socket.emit('quitRoom', {
      roomName: props.room.name,
      userId: user.id,
    })
    props.cleanRoomLoginData()
  }

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const [openChangePwd, setOpenChangePwd] = useState(false);
  const handleClickOpenChangePwd = () => {
    setOpenChangePwd(true);
  };
  const handleCloseChangePwd = () => {
	handleChangePwd(false);
    setOpenChangePwd(false);
  };

	const handleChangePwd = async (deletePwd: boolean) => {
		await socket.emit('changePassword', {
			roomName: props.room.name,
			// currentPassword: oldPassword,
			newPassword: deletePwd ? '' : newPassword,
		});
	};

	const handleAClick = (event: any) => {
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
					<div style={{ display: 'flex', flexDirection: 'row'}}>
						<MemberList members={members} bannedUsers={bannedMembers} />
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


							{ // Begin of owner space for non protected rooms
								(statusUtils.checkIfOwner(props.room.owner, user.id))
									&& isPwdProtected === false
									&& <>
								<MenuItem onClick={handleClickOpenChangePwd} title="Set Password">
									<Password sx={{ color: 'black' }}/>
									<span> Set password</span>
								</MenuItem>
								<div>
									<Modal
										className='black'
										open={openChangePwd}
										onClose={handleCloseChangePwd}>
										<ModalDialog
											aria-labelledby="modal-modal-title"
											sx={MUI.modalDialog}>
											<ModalClose onClick={handleCloseChangePwd}/>
											<Typography
												id="modal-modal-title"
												component="h2"
												className='modal-title'>
												Change password
											</Typography>
											<form onSubmit={handleCloseChangePwd}>
												<Stack spacing={2}>
													<Stack spacing={1}>
													<Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
														New password
													</Typography>
													<TextField
														autoFocus
														required
														helperText="Password must be at least 4 characters long"
														label="new password"
														type="password"
														inputProps={{ minLength: 4 }}
														onChange={(e) => setNewPassword(e.target.value)}
														/>
													</Stack>
													<LoadingButton
														type="submit"
														onClick={handleCloseChangePwd}
														startIcon={<Save />}
														variant='contained'
														color='inherit'>
														SAVE
													</LoadingButton>
												</Stack>
											</form>
										</ModalDialog>
									</Modal>
								</div>
									</>
								// End of owner space for non protected rooms
							}

							{ // Begin of owner space for pwd protected rooms
								(statusUtils.checkIfOwner(props.room.owner, user.id))
									&& isPwdProtected === true
									&& <>
								<MenuItem onClick={handleClickOpenChangePwd} title="Change Password">
									<Password sx={{ color: 'black' }}/>
									<span> Change pwd</span>
								</MenuItem>
								<div>
									<Modal
										className='black'
										open={openChangePwd}
										onClose={handleCloseChangePwd}>
										<ModalDialog
											aria-labelledby="modal-modal-title"
											sx={MUI.modalDialog}>
											<ModalClose onClick={handleCloseChangePwd}/>
											<Typography
												id="modal-modal-title"
												component="h2"
												className='modal-title'>
												Change password
											</Typography>
											<form onSubmit={handleCloseChangePwd}>
												<Stack spacing={2}>
													<Stack spacing={1}>
													<Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
														New password
													</Typography>
													<TextField
														autoFocus
														required
														helperText="Password must be at least 4 characters long"
														label="new password"
														type="password"
														inputProps={{ minLength: 4 }}
														onChange={(e) => setNewPassword(e.target.value)}
														/>
													</Stack>
													<LoadingButton
														type="submit"
														onClick={handleCloseChangePwd}
														startIcon={<Save />}
														variant='contained'
														color='inherit'>
														SAVE
													</LoadingButton>
												</Stack>
											</form>
										</ModalDialog>
									</Modal>
								</div>
								<MenuItem onClick={() => handleChangePwd(true)} title="Delete Password">
									<Delete sx={{ color: 'black' }} />
									<span> Delete pwd</span>
								</MenuItem>
								</>
								// End of owner space
								}
							{/* </>
							: <></>} */}
							<MenuItem onClick={onReturnClick} title="Leave Room">
								<ExitToApp className='black' />
								<span> Leave room</span>
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<Clear className='black'/>
								<span>Close</span>
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
									<AvatarBadge
										nickname={msg.author.nickname}
										status={user.status}/* catch isOnline*/
										admin={statusUtils.checkIfAdmin(members, msg.author.id)}
										oper={statusUtils.checkIfOwner(props.room.owner, msg.author.id)}
										avatar={msg.author.avatar}
										look={true}/>
									<div>
										<div className="msgLeft msgBubble">
											<p className="msgText">{msg.data}</p>
											<div className="msgTime">{timeFromNow(msg.timestamp)}</div>
										</div>
									</div>
								</div>
							}
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