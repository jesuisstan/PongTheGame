import {
  useContext, useEffect, useState, useRef
      } from 'react';
import * as React from 'react';
import {
  Box,
  List,
  ListItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  CssBaseline,
  ListItemSecondaryAction
} from '@mui/material';
import {
  TagRounded,
  LockRounded,
  ArrowForwardIos,
  AddCircleOutline,
  LockOpenRounded,
  Person2Rounded
} from '@mui/icons-material';

// personal components
import { UserContext } from '../../contexts/UserContext';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import ChatRoom from './ChatRoom';
import PleaseLogin from '../pages/PleaseLogin';
import { ChatRoomType, MemberType } from '../../types/chat';
// personal css
import './Chat.css';

/*************************************************************
 * Chat entrance
 
 * It is the entrance for chat rooms.
 * Users can create/join chat rooms.
**************************************************************/

interface WinProps {
  window?: () => Window;
}
const Chat = () => {
  /*************************************************************
	 * Chat entrance
	 
	 * It is the entrance for chat rooms.
	 * Users can create/join chat rooms.
	************************************************************/
  /*************************************************************
   * States
   **************************************************************/
  // Fetching the socket from its context
  const socket = useContext(WebSocketContext);
  // Fetching the user profile from its context
  const { user, setUser } = useContext(UserContext);
  // Array including all chat rooms
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);

  // Create chat room
  const [chatRoomCreateMode, setChatRoomCreateMode] = useState<boolean>(false);
  const [newChatRoomName, setNewChatRoomName] = useState<string>('');
  const [chatRoomPassword, setChatRoomPassword] = useState<string>('');

  // Join chat room
  const [isPasswordProtected, setIsPasswordProtected] =
    useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [isPasswordRight, setIsPasswordRight] = useState<boolean>(false);
  const [clickedRoomToJoin, setClickedRoomToJoin] = useState<string>('');

  const findAllChatRooms = async() => {
    await socket.emit('findAllChatRooms', {}, (response: ChatRoomType[]) => {
      setChatRooms(response);
    });
  }
  findAllChatRooms();

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openP, setOpenPass] = React.useState(false);
  const handleClickOpenP = () => {
    setOpenPass(true);
  };
  const handleClosePass = () => {
    setOpenPass(false);
  };
  /*************************************************************
   * Event listeners
   **************************************************************/
  useEffect(() => {
    // Activate listeners and subscribe to events as the component is mounted
    socket.on('connect', () => console.log('Connected to websocket'));
    socket.on('createChatRoom', (roomName: string) => {
      console.log('Created new chat room [' + roomName + ']');
    });
    socket.on('exception', (res) => {
      console.log('ERROR: ' + res.msg);
    });

    // Clean listeners to unsubscribe all callbacks for these events
    // before the component is unmounted
    return () => {
      socket.off('connect');
      socket.off('createChatRoom');
      socket.off('exception');
    };
  }, []);

  // When clicking on the 'new' button to create a new chat room
  const onNewClick = () => {
    setChatRoomCreateMode(true);
    handleClickOpen();
  };

  const onChatRoomCreateModeSubmit = async(e: any) => {
    e.preventDefault();
    if (newChatRoomName)
      await socket.emit('createChatRoom', {
        room: {
          name: newChatRoomName,
          modes: '',
          password: chatRoomPassword,
          userLimit: 0,
          members: {},
          messages: [],
          bannedUsers: [],
        },
        user1: user,
        user2: '',
      });
    setNewChatRoomName('');
    setChatRoomCreateMode(false);
    setChatRoomPassword('');
  };
  // Handle value changes of the input fields during new chatroom create mode
  const onValueChange = (type: string, value: string) => {
    if (type === 'name') setNewChatRoomName(value);
    if (type === 'password') setChatRoomPassword(value);
  };
  // When clicking on a room name to join it
  const onClickJoinRoom = async(roomName: string) => {
    if (roomName !== user.joinedChatRoom) {
      await socket.emit('quitRoom', {
        roomName: user.joinedChatRoom,
        userId: user.id,
      })
    }
    // Notify that the user has clicked on a 'join' button
    setClickedRoomToJoin(roomName);
    handleClickOpenP();
    // Check if the corresponding chat room is password protected
    await socket.emit(
      'isPasswordProtected',
      { roomName: roomName },
      (response: boolean) => {
        setIsPasswordProtected(response);
    });
      isPasswordProtected === false ? joinRoom(roomName) : onPasswordSubmit();
  };
  // Join a chatroom if no password has been set
  const joinRoom = async (roomName: string) => {

    await socket.emit(
      'joinRoom',
      { roomName: roomName, userId: user.id },
      (response: string) => {
        user.joinedChatRoom = response;
        setClickedRoomToJoin('');
    });
  };
  // Check if the password is right
  const onPasswordSubmit = async() => {
    if (clickedRoomToJoin) {
      await socket.emit(
        'checkPassword',
        { roomName: clickedRoomToJoin, password: inputPassword },
        (response: boolean) => {
          response === true
            ? setIsPasswordRight(true) 
            : setIsPasswordRight(false);
      });
      if (isPasswordRight) joinRoom(clickedRoomToJoin);
      setClickedRoomToJoin('');
      setInputPassword('');
      handleClosePass();
    }
  };
  // Check if user is authorized to see the private chat room
  const isAuthorizedPrivRoom = (mode: string, members: MemberType[]) => {
    if (mode.indexOf('i') !== -1) {
      for (const id in members) {
        if (members[id].memberId === user.id) return true;
      }
    } else return true;
    return false;
  };
  // Clean all data about the joined room
  const cleanRoomLoginData = () => {
    user.joinedChatRoom = '';
    setClickedRoomToJoin('');
    setIsPasswordProtected(false);
    setIsPasswordRight(false);
  };


  /*************************************************************
   * Render HTML response
  **************************************************************/
  return !user.provider ? (
<PleaseLogin />
  ) : (
      <Box id="basicCard">
        <CssBaseline />
        <Box component="main" id="chatRoomList">
          {chatRooms.length === 0 ? (
            <Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      'No channel joined. Click to the + button for create one.'
                    }
                    sx={{ color: 'white' }}
                  />
                </ListItem>
              </List>
            </Box>
          ) : (
            <Box>
              <List>
                {/* Mapping chatroom array to retrieve all chatrooms with */}
                {chatRooms.map(
                  (room: ChatRoomType, index) => (
                  // Check if this isn't a private conversation of other users
                  isAuthorizedPrivRoom(room.modes, room.members) &&
                  <>
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ color: 'white' }}>
                      {
                      room.modes === "p" ? (
                        <LockRounded />
                      ) : room.modes === "i" ? (
                        <Person2Rounded />) : (
                        <TagRounded />
                      ) }
                    </ListItemIcon>
                    {clickedRoomToJoin === room.name &&
                      room.modes.indexOf('p') !== -1 && (
                        // if the room is already joined, don't display the password dialog
                        <>
                          <Dialog
                          open={openP}
                            onClose={handleClosePass}
                            onSubmit={onPasswordSubmit}
                          >
                            <DialogTitle>Enter password</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Please enter the password to join this channel
                              </DialogContentText>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={inputPassword}
                                onChange={(e) =>
                                  setInputPassword(e.target.value)
                                }
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClosePass}>Cancel</Button>
                              <Button onClick={onPasswordSubmit}>Join</Button>
                            </DialogActions>
                          </Dialog>
                        </>
                      )}
                    <ListItemButton onClick={() => onClickJoinRoom(room.name)}>
                      <ListItemText
                        tabIndex={-1}
                        primary={
                          room.name[0] === '#' ? room.name.slice(1) : room.name
                          // Slicing the '#' character at position 0 which is
                          // used for private room names
                        }
                        className="limitText white"
                        />
                      <ListItemIcon sx={{ color: 'white' }}>
                        <ArrowForwardIos />
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                  </>
                ))}
              </List>
            </Box>
          )}
          {/* Button that gets into chatroom create mode */}
          {chatRooms.length <
            parseInt(process.env.REACT_APP_MAX_CHATROOM_NBR!) && (
            <Button onClick={onNewClick} sx={{ color: 'white' }}>
              <AddCircleOutline />
            </Button>
          )}
          {/* Chatroom create mode form */}
          {chatRoomCreateMode && (
            <Dialog
              open={open}
              onClose={handleClose}
              onSubmit={onChatRoomCreateModeSubmit}
            >
              <DialogTitle>Create room</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Your are free to add a password or not to this chatroom.
                </DialogContentText>
                <TextField
                  autoFocus
                  required={true}
                  helperText="Limit 20 characters"
                  inputProps={{ inputMode: 'text', maxLength: 20 }}
                  margin="dense"
                  id="name"
                  label="Chatroom name"
                  type="name"
                  value={newChatRoomName}
                  onChange={(e) => onValueChange('name', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="Room password"
                  type="password"
                  value={chatRoomPassword}
                  onChange={(e) => onValueChange('password', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={onChatRoomCreateModeSubmit}>Create</Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
        <Box component="main" id="chatRoom">
          {user.joinedChatRoom &&
          ((isPasswordProtected && isPasswordRight) || !isPasswordProtected) ? (
            <ChatRoom cleanRoomLoginData={cleanRoomLoginData} />
          ) : (
            <div className="black">
              <h2>Actually no room joined</h2>
              <p>To join a room click on the arrow on the left</p>
              <p>Or add a new chan with the + button</p>
            </div>
          )}
        </Box>
      </Box>  );
};

export default Chat;
