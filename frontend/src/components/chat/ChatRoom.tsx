import { SetStateAction, useContext, useEffect, useState } from 'react';
import { WebSocketContext, socket } from '../../contexts/WebsocketContext';
import {
	Send, Delete, ArrowBackIosNew, Settings,PersonAddAlt, Password,
	ExitToApp, Mail, Clear, PanTool, PersonAdd, VolumeUp, VolumeOff, Room
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
    })

    socket.emit('isUserOper',
      { roomName: user.joinedChatRoom, userId: user.id },
      (response: boolean) => {
        setIsOper(response)
      }
    )

    socket.emit('isUserMuted',
    { roomName: user.joinedChatRoom, userId: user.id },
    (response: boolean) => {
      setIsMuted(response)
    }
  )
  socket.emit('saveBlockedUsersToDB', {
	user: user,
	blockedUsers: user.blockedUsers
})

  /*************************************************************
   * Event listeners
   **************************************************************/
  useEffect(() => {
    // Activate listeners and subscribe to events as the component is mounted
    // socket.on('connect', () => console.log('connected to websocket!'))
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
    socket.on('makeOper', (roomName: string, target: number) => {
      if (roomName === user.joinedChatRoom)
        console.log(target + ' is Oper now!')
    })
    socket.on('joinRoom', (roomName: string, userId: number) => {
      if (roomName === user.joinedChatRoom)
        console.log('user ID: ' + userId + ' joined chatroom [' + roomName + ']');
    });
    socket.on('quitRoom', (roomName: string, userId: number) => {
      if (roomName === user.joinedChatRoom)
        console.log(userId + ' quit room [' + roomName + ']')
    });
    socket.on('kickUser', (roomName: string, target: number) => {
      if (roomName === user.joinedChatRoom)
        console.log(target + ' has been kicked!')
      if (target === user.id) props.cleanRoomLoginData()
    });
      socket.on('banUser', (roomName: string, target: number) => {
      if (roomName === user.joinedChatRoom)
        console.log(target + ' has been banned!')
      if (target === user.id) props.cleanRoomLoginData()
    })
    socket.on('unBanUser', (roomName: string, target: number) => {
      if (roomName === user.joinedChatRoom)
        console.log(target + ' has been unbanned!')
    })
    socket.on('muteUser', (roomName: string, target: number) => {
      if (roomName === user.joinedChatRoom)
        console.log(target + ' has been muted!')
      if (target === user.id) props.cleanRoomLoginData()
    })
    socket.on('unMuteUser', (roomName: string, target: number) => {
      if (roomName === user.joinedChatRoom)
        console.log(target + ' has been unmuted!')
    })

    // Clean listeners to unsubscribe all callbacks for these events
    // before the component is unmounted
    return () => {
    //   socket.off('connect')
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
  const onBlockClick = (target: number) => {
    user.blockedUsers.push(target)
	socket.emit('saveBlockedUsersToDB', {
		user: user,
		blockedUsers: user.blockedUsers
	})
	console.log("You've blocked " + target + "!")
  }
  // When clicking on the 'unblock' button to unblock a user
  const onUnBlockClick = (target: number) => {
    for (var i=0; i < user.blockedUsers.length; ++i)
      if (user.blockedUsers[i] === target)
      {
        user.blockedUsers.splice(i, 1)
        break;
      }
  }

  // When clicking on the 'ban' button to ban a user
  const onBanClick = (target: number) => {
    socket.emit('banUser', {
      roomName: user.joinedChatRoom,
      userId: user.id,
      target: target
    })
  }
  // When clicking on the 'unban' button to unban a user
  const onUnBanClick = (target: number) => {
    socket.emit('unBanUser', {
      roomName: user.joinedChatRoom,
      userId: user.id,
      target: target
    })  
  }

  const isUserBanned = (userId: number) => {
    socket.emit('isUserBanned', {
      roomName: user.joinedChatRoom,
      userId: userId
    }, (response: boolean) => {
      return response
    })
  }
  
  // When clicking on the 'kick' button to kick a user
  const onKickClick = (target: number) => {
    socket.emit('kickUser', {
      roomName: user.joinedChatRoom,
      userId: user.id,
      target: target
    })
  }

  // When clicking on the 'oper' button to make a user oper
  const onMakeOperClick = (target: number) => {
    socket.emit('makeOper', {
      roomName: user.joinedChatRoom,
      userId: user.id,
      target: target
    })  
  }

  // When clicking on the 'mute' button to mute a user
  const onMuteUserClick = (target: number) => {
    socket.emit('muteUser', {
      roomName: user.joinedChatRoom,
      userId: user.id,
      target: target,
      mute: true
    })  
  }

  // When clicking on the 'unmute' button to unmute a user
  const onUnMuteUserClick = (target: number) => {
    socket.emit('muteUser', {
      roomName: user.joinedChatRoom,
      userId: user.id,
      target: target,
      mute: false
    })
  }

  // When clicking on the 'message' button to send a private
  // message to the user
  const onPrivMessageClick = (user2Id: number, user2: User) => {
    socket.emit('createChatRoom', {
      room: {
        name: '#' + user.nickname + '/' + user2.nickname, /* TODO change to nick */
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

    socket.emit('isUserMuted',
    { roomName: user.joinedChatRoom, userId: user.id },
    (response: boolean) => {
      setIsMuted(response)
    }
  )

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
				if (user.blockedUsers[user.id])
						return true;
		return false;
	}}

	const [isUserBan, setIsUserBan] = useState<boolean>(false);
	
	const isBan = (user: any) => {
		socket.emit('isUserBanned', { roomName: user.joinedChatRoom, userId: user.id },
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
				{ 
					// if private message don't display the list of member
					user.joinedChatRoom[0] === "#"
					? <></> 
					: <Stack direction="row" spacing={1}>
					{ 
// ------------- List of Member's in room ------------- 
				Object.keys(members).map((nick, index) => (
					<div key={ index }>
							<>

{/* ----------------------------------------------------------------
					HERE FIND HOW TO DISPLAY THE AVATAR OF THE USER
				---------------------------------------------------------------- */}
							{/* <AvatarBadge
								nickname='Nom'
								online={members[nick as any].isOnline.isOnline}
								admin={isOper && (user.nickname !== nick) &&
									String(members[nick as any].modes).search('o') === -1}
									oper={String(members[nick as any].modes).search('o') !== -1} 
									avatar=""
									look={false}/>		 */}
{/* // If user is oper(=admin), the button to kick users is displayed!
	// If user is oper(=admin), the button to ban users is displayed 
	// If user is oper(=admin), the button to unban users is displayed  */}
							{/* { 
								isOper && (user.nickname !== nick) &&
								String(members[nick as any].modes).search('o') === -1 &&
								<>
								<button onClick={ () => onKickClick(nick) }>
									kick
								</button>
								<button onClick={ () => onBanClick(nick) }>
									ban
								</button>
								<button onClick={ () => onUnBanClick(nick) }>
									unban
								</button>
									</>
							} */}
{/* // is not the user himself 
		//Block button appears if the author of the message
		// Unblock button appears if the author of the message */}
							{/* { 
								(user.nickname !== nick) &&
								<>
								<button onClick={ () => onBlockClick(nick) }>
								block
								</button>
								<button onClick={ () => onUnBlockClick(nick) }>
								unblock
								</button>
								</>
							} */}
							</>
						</div>
						))}
					</Stack> 
					}
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
						Lets chat here ! {user.joinedChatRoom}
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
							<>
						{ user.joinedChatRoom[0] === "#" 
						? <></>
						:	<><MenuItem onClick={() => handleChangePwd(false)} aria-label="change password">
									<Password sx={{ color: 'black' }} />
								</MenuItem>
								<MenuItem onClick={() => handleChangePwd(true)} aria-label="delete password">
									<Delete sx={{ color: 'black' }} />
								</MenuItem>
							</>
						}
								<MenuItem onClick={onReturnClick} aria-label="leave room">
									<ExitToApp className='black' />
								</MenuItem>
							</>
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
// -------------- Else: Display messages --------------
							(
							<Stack> {
									messages.map((msg, index) => (
									<div key={index}>
										{
											user.id === msg.author.id ? (
												<>
													<div className="msgRowR">
															<div className='msgRight msgBubble'>
																	<p className="msgText">{msg.data}</p>
																	<div className="msgTime">{timeFromNow(msg.timestamp)}</div>
															</div>
													</div>
												</>
											) : (
												<>
													<div className="msgRowL">
													<>
{/*// -------------- Avatar Clickable -------------- */}
													<Button
														aria-controls="basic-menu"
														aria-haspopup="true"
														aria-expanded={Boolean(anchorAvatar)}
														onClick={handleAClick}
													>
{/*// -------------- Avatar Badge -------------- */}
{/* ----------------------------------------------------------------
 HERE ADD FUNCTION TO CHECK IF IS ONLINE, IF IS OPER, IF IS ADMIN
    ---------------------------------------------------------------- */}
													<AvatarBadge
														nickname={msg.author.nickname}
														online={true}
														admin={false}
														oper={true}
														avatar={msg.author.avatar}
														look={true}/>
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
															{/* <IconButton onClick={ () => 
																isUserMuted(msg.author.nickname) 
																? onUnMuteClick(msg.author.nickname)
																: onMuteClick(msg.author.nickname)} >
																{isUserMuted(msg.author.nickname)
																? <VolumeOff className='black'/>
																: <VolumeUp className='black'/>}
															</IconButton> */}
															<IconButton >
																<VolumeOff className='black'/>
															</IconButton>
															<IconButton onClick={() => onPrivMessageClick(msg.author.id, msg.author) }>
																<Mail className='black'/>
															</IconButton>
															<IconButton onClick={ () =>
																isUserBlocked(msg.author.id)
																? onUnBlockClick(msg.author.id)
																: onBlockClick(msg.author.id) } >
																<PanTool className={!isUserBlocked(msg.author.id)? 'black': 'white'}/>
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
																		? (() => onBanClick(msg.author.id)) 
																		: (() => onUnBanClick(msg.author.id)) 
																		}
																/>
																<FormControlLabel
																	value="start"
																	control={<Switch color="error" />}
																	label="Block "
																	labelPlacement="start"
																	onChange={
																		isUserBlocked(msg.author.id) === false 
																		? (() => onBlockClick(msg.author.id))
																		: (() => onUnBlockClick(msg.author.id))}
																/>
															</FormGroup>
														</FormControl>
													</Menu>
{/*// -------------- End Avatar / Menu -------------- */}
													</>							
														<div>
																{/* <div className="nickName">{msg.author.nickname}</div> */}
																<div className="msgLeft msgBubble">
																		<p className="msgText">{msg.data}</p>
{/* ----------------------------------------------------------------
					HERE FIND WHY TIME IS NOT DISPLAYED WITH TIMEFROMNOW()
		---------------------------------------------------------------- */}		
																		<div className="msgTime">{timeFromNow(msg.timestamp)}</div>
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
