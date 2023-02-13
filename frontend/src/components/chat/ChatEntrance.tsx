import { SetStateAction, useContext, useEffect, useState } from "react";
import { WebSocketContext, WebSocketProvider } from "../../contexts/WebsocketContext";
import ChatRoom from "./ChatRoom";

// // All newly created message should have an author and the message itself
// export type MessagePayload = {
// 	author: string
// 	data: string
// }

// It takes the logged in user's profile as argument
// The messages are displayed alongside some of the profile info
const ChatEntrance = ({ user }: any) => {

  const socket = useContext(WebSocketContext)

  // Array including all chat rooms
  const [chatRooms, setChatRooms] = useState<any[]>([])
  // Tells whether the user has joined the chatroom
  const [joinedRoom, setJoinedRoom] = useState<any>()

  // Enter in chatroom create mode
  const [chatRoomCreateMode, setChatRoomCreateMode] = useState<boolean>(false)
  const [newChatRoomName, setNewChatRoomName] = useState<string>('')

  const [nickName, setnickName] = useState<string>(user.nickname || '')

  socket.emit('findAllChatRooms', {}, (response: SetStateAction<any[]>) => {
    setChatRooms(response)
  })

  // Add event listeners
  useEffect(() => {
    socket.on('connect', () => console.log('Connected to websocket'))
    
    socket.on('createChatRoom', (roomName: string) => {
      console.log('Created new chat room [' + roomName + ']')
    })

    socket.on('joinRoom', (roomName: string) => {
      setJoinedRoom(roomName)
      console.log(user.nickname + ' joined chatroom ' + roomName)
    })

    socket.on('quitRoom', (userName: string) => {
      if (userName === user.nickname)
      {
        setJoinedRoom('')
        console.log(userName + ' quit room')
      }
    })
    // Clean listeners to avoid multiple activations
    return () => {
      socket.off('connect')
      socket.off('createChatRoom')
      socket.off('joinRoom')
      socket.off('quitRoom')
    }
  }, [])

  const onNewClick = () => setChatRoomCreateMode(true)

  const onChatRoomCreateModeSubmit = (e: any) => {
    e.preventDefault()
    if (newChatRoomName)
      socket.emit('createChatRoom', { name: newChatRoomName,
                                      modes: '',
                                      password: '',
                                      userLimit: 0,
                                      users: {},
                                      banList: [],
                                      messages: [] })
    setNewChatRoomName('')
    setChatRoomCreateMode(false)
  }

  // Handle value changes of the input fields during new chatroom create mode
  const onValueChange = (type: string, value: string) => {
    if (type === 'name')
      setNewChatRoomName(value)
    if (type === "nick")
      setnickName(value)
  }
  // Join a chatroom
  const joinRoom = (roomName: string) => {
    socket.emit('joinRoom',
      { roomName: roomName, user: user },
      (response: SetStateAction<any>) => {
      setJoinedRoom(response)
    })
  }

  const onNickSubmit = (e: any) => {
    e.preventDefault()
    user.nickname = nickName
  }

  return (
    <WebSocketProvider value={socket}>

        <h1>Let's chat together right now</h1>
          {
            !user.nickname ? (
              <form onSubmit={ onNickSubmit }>
                <label htmlFor="nick">Choose a nickname</label>

                <input type="text" id="nick" 
                  value={ nickName }
                  onChange={ (e) => onValueChange("nick", e.target.value) } />

                <button type="submit">send</button>
              </form>
            ) :
            (
              joinedRoom ? (
                <ChatRoom user={ user } room={ joinedRoom } />
                ) : (
                <div>
                  {
                    chatRooms.length === 0 ? (<div>No channel</div>) : (
                      <ul>
                        { // Mapping chatroom array to retrieve all chatrooms with
                          chatRooms.map((room, index) => (
                            <li key={ index }>
                              [{ room.name }]: { Object.keys(room.users).length } members
                              | { Object.keys(room.messages).length } messages
                              { Object.values(room.modes).indexOf('p') !== -1 ? '| P ' : ' ' }

                              <button onClick={ () => joinRoom(room.name) }>join</button>
                            </li>
                          ))
                        }
                      </ul>
                  )
                  }

                  { // Button that gets into chatroom create mode 
                    chatRooms.length < parseInt(process.env.REACT_APP_MAX_CHATROOM_NBR!)
                      && <button onClick={ onNewClick }>new</button>
                  }
                  
                  { // Chatroom create mode form
                    chatRoomCreateMode &&
                    <form onSubmit={ onChatRoomCreateModeSubmit }>
                      <input type="text" value={ newChatRoomName } onChange={ (e) => onValueChange('name', e.target.value) }/>
                      <button type="submit">create</button>
                    </form>
                  }
                </div>
              )
            )
          }
    </WebSocketProvider>
  )
}

export default ChatEntrance
