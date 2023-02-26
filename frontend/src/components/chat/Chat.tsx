import { SetStateAction, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import ChatRoom from './ChatRoom';
import PleaseLogin from '../pages/PleaseLogin';
import { ChatRoomType } from "../../types/chat";


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
  const socket = useContext(WebSocketContext)
  // Fetching the user profile from its context
  const { user, setUser } = useContext(UserContext);

  // Array including all chat rooms
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  // Tells whether the user has joined the chatroom
  const [joinedRoom, setJoinedRoom] = useState<string>(user.joinedChatRoom);

  // Enter in chatroom create mode
  const [chatRoomCreateMode, setChatRoomCreateMode] = useState<boolean>(false);
  const [newChatRoomName, setNewChatRoomName] = useState<string>('');
  const [chatRoomPassword, setChatRoomPassword] = useState<string>('');
  const [isPasswordProtected, setIsPasswordProtected] =
    useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [isPasswordRight, setIsPasswordRight] = useState<boolean>(false);
  const [joinRoomClicked, setJoinRoomClicked] = useState<string>('');

  socket.emit('findAllChatRooms', {}, (response: SetStateAction<ChatRoomType[]>) => {
    setChatRooms(response);
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
    socket.on('joinRoom', (roomName: string) => {
      setJoinedRoom(roomName);
      console.log(user.nickname + ' joined chatroom [' + roomName + ']');
    });
    socket.on('quitRoom', (userName: string) => {
      if (userName === user.nickname)
      {
        console.log(userName + ' quit room [' + joinedRoom + ']')
        setJoinedRoom('')
      }
    })

    // Clean listeners to unsubscribe all callbacks for these events
    // before the component is unmounted
    return () => {
      socket.off('connect');
      socket.off('createChatRoom');
      socket.off('joinRoom');
      socket.off('quitRoom');
    };
  }, []);

  // When clicking on the 'new' button to create a new chat room
  const onNewClick = () => setChatRoomCreateMode(true);

  const onChatRoomCreateModeSubmit = (e: any) => {
    e.preventDefault();
    if (newChatRoomName)
      socket.emit('createChatRoom', {
        name: newChatRoomName,
        modes: '',
        password: chatRoomPassword,
        userLimit: 0,
        users: {},
        messages: [],
        bannedNicks: []
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

  const onClickJoinRoom = (roomName: string) => {
    // Notify that the user has clicked on a 'join' button
    setJoinRoomClicked(roomName);

    // Check if that the corresponding chat room is password protected
    socket.emit(
      'isPasswordProtected',
      { roomName: roomName },
      (response: SetStateAction<boolean>) => {
        console.log('isprotec?? ' + response);
        setIsPasswordProtected(response);
        console.log('isprotec2 ?? ' + response);
        console.log('isprotec3 ?? ' + isPasswordProtected);
      }
    );

    isPasswordProtected === false ? joinRoom(roomName) : onPasswordSubmit();
  };

  // Join a chatroom if no password has been set
  const joinRoom = (roomName: string) => {
    try {
    socket.emit(
      'joinRoom',
      { roomName: roomName, user: user },
      (response: SetStateAction<any>) => {
        setJoinedRoom(response);
      }
    );
    } catch(error) {
      console.log(error)
    }
  };

  // Check if the password is right
  const onPasswordSubmit = () => {
    // e.preventDefault()
    socket.emit(
      'checkPassword',
      { roomName: joinRoomClicked, password: inputPassword },
      (response: SetStateAction<boolean>) => {
        response === true
          ? setIsPasswordRight(true)
          : setIsPasswordRight(false);
      }
    );
    if (isPasswordRight) joinRoom(joinRoomClicked);
    setInputPassword('');
  };

  const cleanRoomLoginData = () => {
    setJoinedRoom('');
    setIsPasswordProtected(false);
    setIsPasswordRight(false);
  };

  /*************************************************************
   * Render HTML response
   **************************************************************/
  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className="baseCard">
      {
        // If user has joined and given the right password,
        // or no password is asked, then display the room
        joinedRoom &&
        ((isPasswordProtected && isPasswordRight) || !isPasswordProtected) ? (
          <ChatRoom
            room={joinedRoom}
            cleanRoomLoginData={cleanRoomLoginData}
          />
        ) : (
          <div>
            {chatRooms.length === 0 ? (
              <div>No channel</div>
            ) : (
              <ul>
                {
                  // Mapping chatroom array to retrieve all chatrooms with
                  chatRooms.map((room, index) => (
                    // Chat room not private (not a conversation of 2 users)
                    (room.modes.search('i') === -1) 
                    &&
                    <li key={index}>
                      [{room.name}]: {Object.keys(room.users).length} members |{' '}
                      {Object.keys(room.messages).length} messages
                      {Object.values(room.modes).indexOf('p') !== -1
                        ? '| PWD '
                        : ' '}
                      {joinRoomClicked === room.name &&
                        Object.values(room.modes).indexOf('p') !== -1 && (
                          <>
                            <label htmlFor="password">password</label>
                            <input
                              type="password"
                              id="password"
                              value={inputPassword}
                              onChange={(e) => setInputPassword(e.target.value)}
                            />
                          </>
                        )}
                      <button onClick={() => onClickJoinRoom(room.name)}>
                        join
                      </button>
                    </li>
                  ))
                }
              </ul>
            )}

            {
              // Button that gets into chatroom create mode
              chatRooms.length <
                parseInt(process.env.REACT_APP_MAX_CHATROOM_NBR!) && (
                <button onClick={onNewClick}>new</button>
              )
            }

            {
              // Chatroom create mode form
              chatRoomCreateMode && (
                <form onSubmit={onChatRoomCreateModeSubmit}>
                  <label htmlFor="roomCreateSubmit">name</label>
                  <input
                    type="text"
                    id="rommCreateSubmit"
                    value={newChatRoomName}
                    onChange={(e) => onValueChange('name', e.target.value)}
                  />

                  <label htmlFor="password">password</label>
                  <input
                    type="password"
                    id="password"
                    value={chatRoomPassword}
                    onChange={(e) => onValueChange('password', e.target.value)}
                  />

                  <button type="submit">create</button>
                </form>
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default Chat;
