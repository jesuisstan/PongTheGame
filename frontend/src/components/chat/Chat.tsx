import { useContext, useEffect, useState } from 'react';
import * as React from 'react';
import {
  Box,
  List,
  ListItem,
  TextField,
  Button,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  CssBaseline,
  Modal,
  Typography,
  Stack
} from '@mui/material';
import {
  TagRounded,
  LockRounded,
  ArrowForwardIos,
  AddCircleOutline,
  LockOpenRounded,
  Person2Rounded
} from '@mui/icons-material';
import CreateIcon from '@mui/icons-material/Create';
import { ModalClose, ModalDialog } from '@mui/joy';
import { LoadingButton } from '@mui/lab';
// personal components
import errorAlert from '../UI/errorAlert';
import { UserContext } from '../../contexts/UserContext';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import ChatRoom from './ChatRoom';
import PleaseLogin from '../pages/PleaseLogin';
import { ChatRoomType, MemberType } from '../../types/chat';
// personal css
import './Chat.css';
import * as MUI from '../UI/MUIstyles';
import * as color from '../UI/colorsPong';

/*************************************************************
 * Chat entrance
 
 * It is the entrance for chat rooms.
 * Users can create/join chat rooms.
**************************************************************/

const Chat = () => {

  /*************************************************************
   * States
   **************************************************************/
  // Fetching the socket from its context
  const socket = useContext(WebSocketContext);
  // Fetching the user data from its context
  const { user } = useContext(UserContext);
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

  const findAllChatRooms = async () => {
    socket.emit('findAllChatRooms', {}, (response: ChatRoomType[]) => {
      setChatRooms(response);
    });
  };
  findAllChatRooms();

  const [open, setOpen] = useState<boolean>(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const warningName = () => {
    setOpen(false);
    errorAlert('Room name already used');
  };
  const warningRoomLimit = () => {
    setOpen(false);
    errorAlert('Room limit reached (30 max)');
  };
  const warningEmptyName = () => {
    setOpen(false);
    errorAlert('Room name cannot be empty');
  };

  const [openP, setOpenPass] = useState<boolean>(false);
  const handleClickOpenP = () => {
    setOpenPass(true);
  };
  const handleClosePass = () => {
    setOpenPass(false);
  };
  const warningWrongPass = () => {
    setOpenPass(false);
    errorAlert('Password dismatch');
  };
  const warningEmptyPass = () => {
    setOpenPass(false);
    errorAlert('Password cannot be empty');
  };

  socket.on('connect', () => {
    // console.log('Connected to websocket')
  });
  socket.on('createChatRoom', (roomName: string) => {
    // console.log('Created new chat room [' + roomName + ']');
  });
  socket.on('exception', (res) => {
    errorAlert(String(res.msg));
  });

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
      console.error('ERROR: ' + res.msg);
    });
    socket.on('createMessage', () => {
      console.log("Received new message!")
    })

    // Clean listeners to unsubscribe all callbacks for these events
    // before the component is unmounted
    return () => {
      socket.off('connect');
      socket.off('createChatRoom');
      socket.off('exception');
      socket.off('createMessage');
    };
  }, [socket]);

  // When clicking on the 'new' button to create a new chat room
  const onNewClick = () => {
    setChatRoomCreateMode(true);
    handleClickOpen();
  };

  const onChatRoomCreateModeSubmit = async (e: any) => {
    e.preventDefault();
    if (newChatRoomName.length === 0) warningEmptyName();
    if (newChatRoomName)
      socket.emit(
        'createChatRoom',
        {
          room: {
            name: newChatRoomName,
            owner: user.id,
            modes: '',
            password: chatRoomPassword,
            userLimit: 0,
            members: {},
            messages: [],
            bannedUsers: []
          },
          user1: user,
          avatar: user.avatar,
          user2Id: undefined,
          user2Nick: undefined
        },
        (response: number) => {
          if (response === 412) warningName();
          else if (response === 409) warningRoomLimit();
        }
      );
    setNewChatRoomName('');
    setChatRoomCreateMode(false);
    setChatRoomPassword('');
  };
  // Handle value changes of the input fields during new chatroom creatmessagesToFiltere mode
  const onValueChange = (type: string, value: string) => {
    if (type === 'name') setNewChatRoomName(value);
    if (type === 'password') setChatRoomPassword(value);
  };
  // When clicking on a room name to join it
  const onClickJoinRoom = async (roomName: string, modes: string) => {
    // Quit current joined room first
    if (user.joinedChatRoom && roomName !== user.joinedChatRoom?.name) {
      socket.emit('quitRoom', {
        roomName: user.joinedChatRoom?.name,
        userId: user.id
      });
    }
    // Notify that the user has clicked on a 'join' button
    // Put this code AFTER the previous quitRoom, since quitRoom
    // cleans clickedRoomToJoin
    setClickedRoomToJoin(roomName);
    handleClickOpenP();
    // Check if the corresponding chat room is password protected
    if (modes.indexOf('p') !== -1) setIsPasswordProtected(true);
    else {
      setIsPasswordProtected(false);
      joinRoom(roomName);
    }
  };
  // Join a chatroom
  const joinRoom = async (roomName: string) => {
    socket.emit(
      'joinRoom',
      { roomName: roomName, user: user, avatar: user.avatar },
      (response: ChatRoomType) => {
        user.joinedChatRoom = response;
        setClickedRoomToJoin('');
      }
    );
  };
  // Check if the given password for joining a chat room is right
  const onPasswordSubmit = async () => {
    if (clickedRoomToJoin) {
      socket.emit(
        'checkPassword',
        { roomName: clickedRoomToJoin, password: inputPassword },
        (response: boolean) => {
          if (response === true) {
            joinRoom(clickedRoomToJoin);
            setIsPasswordRight(true);
          } else {
            if (inputPassword.length === 0) warningEmptyPass();
            else warningWrongPass();
            setIsPasswordRight(false);
          }
        }
      );
    }
    setInputPassword('');
    handleClosePass();
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
    user.joinedChatRoom = undefined;
    setIsPasswordProtected(false);
    setIsPasswordRight(false);
  };

  console.log("chat render");
  /*************************************************************
   * Render HTML response
   **************************************************************/
  return !user.provider || (user.provider && !user.nickname) ? (
    <PleaseLogin />
  ) : (
    <Box id="basicCard">
      <CssBaseline />
      <Box
        component="main"
        id="chatRoomList"
        className={
          user.joinedChatRoom ? 'hidden-smartphone' : 'show-smartphone'
        }
      >
        {chatRooms.length === 0 ? (
          <Box>
            <List>
              <ListItem>
                <ListItemText
                  primary={'No room joined.'}
                  sx={{ color: 'white' }}
                />
              </ListItem>
            </List>
          </Box>
        ) : (
          <Box>
            <List>
              {/* Mapping chatroom array to retrieve all chatrooms */}
              {chatRooms.map(
                (room: ChatRoomType, index) =>
                  // Check if this isn't a private conversation of other users
                  isAuthorizedPrivRoom(room.modes, room.members) && (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ color: 'white' }}>
                        {room.modes === 'p' ? (
                          <LockRounded />
                        ) : room.modes === 'i' ? (
                          <Person2Rounded />
                        ) : (
                          <TagRounded />
                        )}
                      </ListItemIcon>
                      {clickedRoomToJoin === room.name &&
                        room.modes.indexOf('p') !== -1 && (
                          // If 'password protected' mode is found, launch the password dialog
                          // if the room is already joined, don't display the password dialog
                          <Modal
                            className="black"
                            open={openP}
                            onClose={handleClosePass}
                          >
                            <ModalDialog
                              aria-labelledby="basic-modal-dialog-title"
                              sx={MUI.modalDialog}
                            >
                              <ModalClose
                                sx={MUI.modalClose}
                                onClick={handleClosePass}
                              />
                              <Typography
                                id="basic-modal-dialog-title"
                                component="h2"
                                sx={MUI.modalHeader}
                              >
                                Attention!
                              </Typography>
                              <form onSubmit={onPasswordSubmit}>
                                <Box sx={MUI.warningBoxStyle}>
                                  <Typography sx={{ textAlign: 'center' }}>
                                    This room is password protected.
                                    <br />
                                    Please enter the password to join it:
                                  </Typography>
                                  <div style={MUI.loadButtonBlock}>
                                    <TextField
                                      autoFocus
                                      required
                                      type="password"
                                      inputRef={(input) => {
                                        if (input != null) input.focus();
                                      }}
                                      value={inputPassword}
                                      inputProps={{
                                        minLength: 1
                                      }}
                                      placeholder="Password"
                                      // helperText={error} // error message
                                      // error={!!error} // set to true to change the border/helperText color to red
                                      onChange={(e) =>
                                        setInputPassword(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div style={MUI.loadButtonBlock}>
                                    <LoadingButton
                                      type="submit"
                                      onClick={onPasswordSubmit}
                                      startIcon={<LockOpenRounded />}
                                      variant="contained"
                                      color="inherit"
                                      sx={{ minWidth: 142 }}
                                    >
                                      SEND
                                    </LoadingButton>
                                  </div>
                                </Box>
                              </form>
                            </ModalDialog>
                          </Modal>
                        )}
                      <ListItemButton
                        onClick={() => onClickJoinRoom(room.name, room.modes)}
                      >
                        <ListItemText
                          tabIndex={-1}
                          primary={
                            room.name[0] === '#' ?
                            // Slicing the '#' character at position 0 which is
                            // used for private room names, then remove the '/',
                            // then remove the user's name, leaving us with the recipient's name only
                            room.name.slice(1).replace(/\//g, '').replace(user.nickname, '')
                            : room.name
                          }
                          className="limitText white"
                        />
                        <ListItemIcon sx={{ color: 'white' }}>
                          <ArrowForwardIos />
                        </ListItemIcon>
                      </ListItemButton>
                    </ListItem>
                  )
              )}
            </List>
          </Box>
        )}
        {/* Button that gets into chatroom create mode */}
        {chatRooms.length <
          parseInt(process.env.REACT_APP_MAX_CHATROOM_NBR!) && (
          <div className="white column">
            <br />
            Click to + for create new room <br />
            <br />
            <Button onClick={onNewClick} sx={{ color: 'white' }}>
              <AddCircleOutline />
            </Button>
          </div>
        )}
        {/* Chatroom create mode form */}
        {chatRoomCreateMode && (
          <div>
            <Modal
              className="black"
              open={open}
              onSubmit={onChatRoomCreateModeSubmit}
              onClose={handleClose}
            >
              <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                sx={MUI.modalDialog}
              >
                <ModalClose sx={MUI.modalClose} onClick={handleClose} />
                <Typography sx={MUI.modalHeader}>Creating room</Typography>
                <Box sx={MUI.warningBoxStyle}>
                  <form onSubmit={onPasswordSubmit}>
                    <Stack spacing={2}>
                      <Stack spacing={1}>
                        <Typography
                          component="h3"
                          sx={{ color: color.PONG_BLUE, textAlign: 'center' }}
                        >
                          Come up with the Room name:
                        </Typography>
                        <div style={MUI.loadButtonBlock}>
                          <TextField
                            autoFocus
                            required={true}
                            helperText="Max 20 characters"
                            inputProps={{ inputMode: 'text', maxLength: 20 }}
                            id="name"
                            type="name"
                            value={newChatRoomName}
                            // helperText={error} // error message
                            // error={!!error} // set to true to change the border/helperText color to red
                            onChange={(e) =>
                              onValueChange('name', e.target.value)
                            }
                          />
                        </div>
                      </Stack>
                      <Stack spacing={1}>
                        <Typography
                          component="h3"
                          sx={{ color: color.PONG_BLUE, textAlign: 'center' }}
                        >
                          Your are free to add a password or not:
                        </Typography>
                        <div style={MUI.loadButtonBlock}>
                          <TextField
                            type="password"
                            value={chatRoomPassword}
                            placeholder="Password"
                            // helperText={error} // error message
                            // error={!!error} // set to true to change the border/helperText color to red
                            onChange={(e) =>
                              onValueChange('password', e.target.value)
                            }
                          />
                        </div>
                      </Stack>
                      <div style={MUI.loadButtonBlock}>
                        <LoadingButton
                          type="submit"
                          onClick={onChatRoomCreateModeSubmit}
                          startIcon={<CreateIcon />}
                          variant="contained"
                          color="inherit"
                          sx={{ minWidth: 142 }}
                        >
                          CREATE
                        </LoadingButton>
                      </div>
                    </Stack>
                  </form>
                </Box>
              </ModalDialog>
            </Modal>
          </div>
        )}
      </Box>
      <Box
        component="main"
        id="chatRoom"
        className={
          user.joinedChatRoom ? 'show-smartphone' : 'hidden-smartphone'
        }
      >
        {user.joinedChatRoom &&
        ((isPasswordProtected && isPasswordRight) || !isPasswordProtected) ? (
          <ChatRoom
            cleanRoomLoginData={cleanRoomLoginData}
            room={user.joinedChatRoom}
          />
        ) : (
          <div className="black">
            <h2>Actually no room joined</h2>
            <p>To join a room click on the arrow on the left</p>
            <p>Or add a new chan with the + button</p>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Chat;