import { useContext, useEffect, useRef, useState } from 'react';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { ArrowBackIosNew } from '@mui/icons-material';
import {
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
// personal components
import { UserContext } from '../../contexts/UserContext';
import { ChatRoomType, MemberType, Message } from '../../types/chat';
import timeFromNow from './utils/timeFromNow';
import AvatarBadge from './utils/AvatarBadge';
import LinkDetector from './utils/LinkDetector';
// personal css
import './Chat.css';
import { User } from '../../types/User';
import MemberList from './utils/MemberList';
import * as statusUtils from './utils/statusFunctions';
import SettingMenu from './utils/SettingMenu';

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
  const socket = useContext(WebSocketContext);
  const { user } = useContext(UserContext);
  // Array including all members
  const [members, setMembers] = useState<MemberType[]>(props.room.members);
  // Array including all the banned users from the room
  const [bannedMembers, setBannedMembers] = useState<User[]>(
    props.room.bannedUsers
  );
  // Array including all message objects (author + msg) excluding
  // messages from blocked users/users who blocked the user
  const [messages, setMessages] = useState<Message[]>([]);
  // Display typing state of the user
  const [typingDisplay, setTypingDisplay] = useState<string>('');
  // Message input field value
  const [messageText, setMessageText] = useState<string>('');
  // Users from whom the user is blockedd by
  const [blockedBy, setBlockedBy] = useState<User[]>([]);

  const findAllMembers = async () => {
    socket.emit(
      'findAllMembers',
      { roomName: props.room.name },
      (response: MemberType[]) => {
        setMembers(response);
      }
    );
  };
  findAllMembers();

  const findAllBanned = async () => {
    socket.emit(
      'findAllBannedMembers',
      { roomName: props.room.name },
      (response: User[]) => {
        setBannedMembers(response);
      }
    );
  };
  findAllBanned();

	const findBlockedBy = async () => {
		socket.emit(
			'findBlockedBy',
			{ userId: user.id },
			(response: User[]) => {
				setBlockedBy(response);
			}
		);
	};

	// Get all messages from messages array in chat.service
	// and fill the messages variable
	const findAllMessages = async () => {
		socket.emit(
			'findAllMessages',
			{ roomName: props.room.name },
			(response: Message[]) => {
				// Array including all the messages, even the ones from
				// blocked users/users who blocked the user
				const messagesToFilter: Message[] = response;
				for (let i = messagesToFilter.length - 1; i >= 0; --i) {
					// First we filter the recipient's blocked users
					let found: boolean = false;
					for (const blockedUser in user.blockedUsers) {
						if (
							messagesToFilter[i].author.id === user.blockedUsers[blockedUser].id
						) {
							messagesToFilter.splice(i, 1);
							found = true;
							break;
						}
				}
					// Then we filter message by checking is the user is blocked by the author
					if (found === false) {
						findBlockedBy();
						for (const usr in blockedBy) {
							if (blockedBy[usr].id === messagesToFilter[i].author.id) {
								messagesToFilter.splice(i, 1);
								break;
							}
						}
					}
				}
				const filteredMessages = messagesToFilter;
				setMessages(filteredMessages);
			}
		);
	};
	findAllMessages();

    socket.on(
    'typingMessage',
    (roomName: string, nick: string, isTyping: boolean) => {
		// First check if the user who is typing has not blocked the user
		findBlockedBy();
		var isBlocked = false;
		for (const usr in blockedBy) {
			if (blockedBy[usr].nickname === nick) {
				isBlocked = true;
				break;
			}
		}
      isBlocked === false && roomName === props.room.name &&
      isTyping &&
      !statusUtils.isUserBlocked(user, undefined, nick)
        ? setTypingDisplay(nick + ' is typing...')
        : setTypingDisplay('');
    });
    socket.on('changePassword', (roomName: string, isDeleted: boolean) => {
      if (roomName === props.room.name) {
        const status = isDeleted ? 'deleted' : 'modified';
        // console.log('Password from [' + roomName + '] has been ' + status);
      }
    });
    socket.on('joinRoom', (roomName: string, userId: number) => {
      // if (roomName === props.room.name) console.log('user ID: ' + userId + ' joined chatroom [' + roomName + ']');
    });
    socket.on('quitRoom', (roomName: string, userId: number) => {
      if (userId === user.id && roomName === props.room.name) {
        props.cleanRoomLoginData();
        // console.log('user ID: ' + userId + ' quit room [' + roomName + ']');
      }
    });
    socket.on('kickUser', (roomName: string, target: number) => {
      // if (roomName === props.room.name) console.log(target + ' has been kicked!');
      if (target === user.id) props.cleanRoomLoginData();
    });
    // User has made admin
    socket.on('adminUser', (roomName: string, target: number) => {
      // if (roomName === props.room.name) console.log(target + ' is admin now!');
    });
    // User is not admin anymore
    socket.on('unadminUser', (roomName: string, target: number) => {
      // if (roomName === props.room.name) console.log('user ID: ' + target + ' is not admin anymore now!');
    });
    socket.on('banUser', (roomName: string, target: number) => {
      // if (roomName === props.room.name) console.log(target + ' has been banned!');
      if (target === user.id) props.cleanRoomLoginData();
    });
    socket.on('unbanUser', (roomName: string, target: number) => {
      // if (roomName === props.room.name) console.log(target + ' has been unbanned!');
    });
    socket.on('muteUser', (roomName: string, target: number) => {
      // if (roomName === props.room.name) console.log(target + ' has been muted!');
    });
    socket.on('unmuteUser', (roomName: string, target: number) => {
      // if (roomName === props.room.name) console.log(target + ' has been unmuted!');
    });

	/*************************************************************
	* Event listeners
	**************************************************************/
	useEffect(() => {
		// Activate listeners and subscribe to events as the component is mounted
		socket.on(
			'typingMessage',
			(roomName: string, nick: string, isTyping: boolean) => {
				roomName === props.room.name && isTyping && !statusUtils.isUserBlocked(user, undefined, nick)
					? setTypingDisplay(nick + ' is typing...')
					: setTypingDisplay('');
			}
		);
		socket.on('changePassword', (roomName: string, isDeleted: boolean) => {
			if (roomName === props.room.name) {
				const status = isDeleted ? 'deleted' : 'modified';
				console.log('Password from [' + roomName + '] has been ' + status);
			}
		});
		socket.on('joinRoom', (roomName: string, userId: number) => {
			if (roomName === props.room.name)
				console.log(
					'user ID: ' + userId + ' joined chatroom [' + roomName + ']'
				);
		});
		socket.on('quitRoom', (roomName: string, userId: number) => {
			if (userId === user.id && roomName === props.room.name) {
				props.cleanRoomLoginData();
				console.log('user ID: ' + userId + ' quit room [' + roomName + ']');
			}
		});
		socket.on('kickUser', (roomName: string, target: number) => {
			if (roomName === props.room.name)
				console.log(target + ' has been kicked!');
			if (target === user.id) props.cleanRoomLoginData();
		});
		socket.on('adminUser', (roomName: string, target: number) => {
			if (roomName === props.room.name) console.log(target + ' is admin now!');
		});
		socket.on('unadminUser', (roomName: string, target: number) => {
			if (roomName === props.room.name)
				console.log('user ID: ' + target + ' is not admin anymore now!');
		});
		socket.on('banUser', (roomName: string, target: number) => {
			if (roomName === props.room.name)
				console.log(target + ' has been banned!');
			if (target === user.id) props.cleanRoomLoginData();
		});
		socket.on('unbanUser', (roomName: string, target: number) => {
			if (roomName === props.room.name)
				console.log(target + ' has been unbanned!');
		});
		socket.on('muteUser', (roomName: string, target: number) => {
			if (roomName === props.room.name)
				console.log(target + ' has been muted!');
		});
		socket.on('unmuteUser', (roomName: string, target: number) => {
			if (roomName === props.room.name)
				console.log(target + ' has been unmuted!');
		});

		// Clean listeners to unsubscribe all callbacks for these events
		// before the component is unmounted
		return () => {
			socket.off('typingMessage');
			socket.off('changePassword');
			socket.off('joinRoom');
			socket.off('quitRoom');
			socket.off('kickUser');
			socket.off('adminUser');
			socket.off('unadminUser');
			socket.off('banUser');
			socket.off('unbanUser');
			socket.off('muteUser');
			socket.off('unmuteUser');
		};
	}, [props, socket, user]);

  /*************************************************************
   * Events
   **************************************************************/

	// Emit that user is typing, or not typing after timeout
	const emitTyping = () => {
		socket.emit('typingMessage', {
			roomName: props.room.name,
			nick: user.nickname,
			isTyping: true
		});
		setTimeout(() => {
			socket.emit('typingMessage', {
				roomName: props.room.name,
				nick: user.nickname,
				isTyping: false
			});
		}, 1500);
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
      socket.emit('createMessage', {
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
  const msgRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }
  // Scroll to bottom of chat box when a new message is sent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When clicking on the 'return' button
  const onReturnClick = async () => {
    socket.emit('quitRoom', {
      roomName: props.room.name,
      userId: user.id
    });
    props.cleanRoomLoginData();
  };

  /*************************************************************
   * Render HTML response
   **************************************************************/
  return (
    <div id="chatBox">
      <div>
        <Box className="black" id="chatTitle">
          <IconButton onClick={onReturnClick}>
            <ArrowBackIosNew className="black" aria-label="return" />
          </IconButton>
          <Typography className="hidden-smartphone">
            {props.room.name[0] === '#' ?
				// Slicing the '#' character at position 0 which is
				// used for private room names, then remove the '/',
				// then remove the user's name, leaving us with the recipient's name only
				props.room.name.slice(1).replace(/\//g, '').replace(user.nickname, '')
				: props.room.name}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <MemberList members={members} bannedUsers={bannedMembers} />
            <SettingMenu
              roomName={props.room.name}
              owner={props.room.owner}
              onReturn={onReturnClick}
            />
          </div>
        </Box>
        <Divider />
        <Grid container spacing={3}>
          <Grid sx={{ display: 'flex', flexGrow: '1' }}></Grid>
          <Grid item id="chat-window" xs={12}>
            {messages.length === 0 ? (
              <div className="black">No Message</div>
            ) : (
              <Stack className="message-area" spacing={1} ref={msgRef}>
                {' '}
                {messages.map((msg, index) => (
                  <div key={index}>
                    {user.id === msg.author.id ? (
                      <div className="msgRowR">
                        <div className="msgRight msgBubble">
                          <p className="msgText">
                            <LinkDetector>{msg.data}</LinkDetector>
                          </p>
                          <div className="msgTime">
                            {timeFromNow(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="msgRowL">
                        <AvatarBadge
                          nickname={msg.author.nickname}
                          status={user.status} /* catch isOnline*/
                          admin={statusUtils.checkIfAdmin(
                            members,
                            msg.author.id
                          )}
                          oper={statusUtils.checkIfOwner(
                            props.room.owner,
                            msg.author.id
                          )}
                          avatar={msg.author.avatar}
                          look={false}
                        />
                        <div>
                          <div className="msgLeft msgBubble">
                            <p className="msgText">
                              <LinkDetector>{msg.data}</LinkDetector>
                            </p>
                            <div className="msgTime">
                              {timeFromNow(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </Stack>
            )}
            <Grid item xs={10} className="chat-room-text">
              <div className="typingButton hidden-smartphone">
                {typingDisplay && (
                  <div className="black">
                    <CircularProgress color="inherit" />
                    {typingDisplay}
                  </div>
                )}
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
          <Grid sx={{ display: 'flex', flexGrow: '1' }}></Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ChatRoom;
