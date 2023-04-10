import { useContext, useEffect, useState, useRef } from 'react';
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
  ListItemSecondaryAction,
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

import { ModalClose, ModalDialog } from '@mui/joy';
import { LoadingButton } from '@mui/lab';

// personal components
import { UserContext } from '../../contexts/UserContext';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import ChatRoom from './ChatRoom';
import PleaseLogin from '../pages/PleaseLogin';
import { ChatRoomType, MemberType } from '../../types/chat';
// personal css
import './Chat.css';
import * as MUI from '../UI/MUIstyles';

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

  const findAllChatRooms = async () => {
    await socket.emit('findAllChatRooms', {}, (response: ChatRoomType[]) => {
      setChatRooms(response);
    });
  };
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
      // socket.off('connect');
      socket.off('createChatRoom');
      socket.off('exception');
    };
  }, []);

  // When clicking on the 'new' button to create a new chat room
  const onNewClick = () => {
    setChatRoomCreateMode(true);
    handleClickOpen();
  };

  const onChatRoomCreateModeSubmit = async (e: any) => {
    e.preventDefault();
    if (newChatRoomName)
      await socket.emit('createChatRoom', {
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
      });
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
      await socket.emit('quitRoom', {
        roomName: user.joinedChatRoom?.name,
        userId: user.id
      });
    }
    // Notify that the user has clicked on a 'join' button
    // Put this code AFTER the previous quitRoom, since it
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
  // Join a chatroom if no password has been set
  const joinRoom = async (roomName: string) => {
    await socket.emit(
      'joinRoom',
      { roomName: roomName, user: user, avatar: user.avatar },
      (response: ChatRoomType) => {
        user.joinedChatRoom = response;
        setClickedRoomToJoin('');
      }
    );
  };
  // Check if the password is right
  const onPasswordSubmit = async () => {
    if (clickedRoomToJoin) {
      await socket.emit(
        'checkPassword',
        { roomName: clickedRoomToJoin, password: inputPassword },
        (response: boolean) => {
          if (response === true) {
            joinRoom(clickedRoomToJoin);
            setIsPasswordRight(true);
          } else setIsPasswordRight(false);
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

  /*************************************************************
   * Render HTML response
   **************************************************************/
  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <Box id="basicCard">
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
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
                                <ModalClose onClick={handleClosePass} />
                                <Typography
                                  id="basic-modal-dialog-title"
                                  component="h2"
                                  className="modal-title"
                                >
                                  Enter password
                                </Typography>
                                <form onSubmit={onPasswordSubmit}>
                                  <Stack spacing={2}>
                                    <Typography
                                      component="h3"
                                      sx={{ color: 'rgb(37, 120, 204)' }}
                                    >
                                      Type the Room password
                                    </Typography>
                                    <Stack spacing={1}>
                                      <Typography>
                                        Please enter the password to join this
                                        channel
                                      </Typography>
                                      <div></div>
                                    </Stack>
                                    <TextField
                                      autoFocus
                                      required
                                      type="password"
                                      inputRef={(input) => {
                                        if (input != null) input.focus();
                                      }}
                                      value={inputPassword}
                                      inputProps={{
                                        minLength: 6,
                                        maxLength: 6
                                      }}
                                      placeholder="Password"
                                      // helperText={error} // error message
                                      // error={!!error} // set to true to change the border/helperText color to red
                                      onChange={(e) =>
                                        setInputPassword(e.target.value)
                                      }
                                    />
                                    <LoadingButton
                                      type="submit"
                                      onClick={onPasswordSubmit}
                                      startIcon={<LockOpenRounded />}
                                      variant="contained"
                                      color="inherit"
                                    >
                                      SEND
                                    </LoadingButton>
                                  </Stack>
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
                              room.name[0] === '#'
                                ? room.name.slice(1)
                                : room.name
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
                    )
                )}
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
                  <ModalClose onClick={handleClose} />
                  <Typography
                    id="basic-modal-dialog-title"
                    component="h2"
                    className="modal-title"
                  >
                    Create room
                  </Typography>
                  <form onSubmit={onPasswordSubmit}>
                    <Stack spacing={2}>
                      <Stack spacing={1}>
                        <Typography
                          component="h3"
                          sx={{ color: 'rgb(37, 120, 204)' }}
                        >
                          Type the Room name
                        </Typography>
                        <TextField
                          autoFocus
                          required={true}
                          helperText="Limit 20 characters"
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
                      </Stack>
                      <Stack spacing={1}>
                        <Typography
                          component="h3"
                          sx={{ color: 'rgb(37, 120, 204)' }}
                        ></Typography>
                        <Typography>
                          Your are free to add a password or not.
                        </Typography>
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
                      </Stack>
                      <LoadingButton
                        type="submit"
                        onClick={onChatRoomCreateModeSubmit}
                        startIcon={<LockOpenRounded />}
                        variant="contained"
                        color="inherit"
                      >
                        CREATE
                      </LoadingButton>
                    </Stack>
                  </form>
                </ModalDialog>
              </Modal>
            </div>
          )}
        </Box>
        <Box component="main" id="chatRoom">
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
      </div>
    </Box>
  );
};

export default Chat;
