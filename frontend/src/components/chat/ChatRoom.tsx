import { SetStateAction, useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { WebSocketContext } from "../../contexts/WebsocketContext";
import { Message } from "../../types/chat";

// // All newly created message should have an author and the message itself
// export type MessagePayload = {
// 	author: string
// 	data: string
// }

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
  // Array including all the messages, even the ones from
  // blocked users/users who blocked the user
  const [messagesToFilter, setMessagesToFilter] = useState<Message[]>([])
  // Array including all message objects (author + msg) excluding
  // messages from blocked users/users who blocked the user
  const [messages, setMessages] = useState<Message[]>([])
  // Display typing state of the user
  const [typingDisplay, setTypingDisplay] = useState<string>('')
  // Message input field value
  const [messageText, setMessageText] = useState<string>('')

  // Get all messages from messages array in chat.service and fill the messages variable
  socket.emit('findAllMessages',
    { roomName: props.room.name },
    (response: SetStateAction<Message[]>) => {
      setMessagesToFilter(response)
      messagesToFilter.map((msg, index) => {
        for (const blockedUser in user.blockedUsers)
          if (msg.author === blockedUser)
            setMessagesToFilter(messagesToFilter.filter((msg, id) => id !== index))
      })
      setMessages(messagesToFilter)
  })


  /*************************************************************
   * Event listeners
  **************************************************************/
  useEffect(() => {
    // Activate listeners and subscribe to events as the component is mounted
    socket.on('connect', () => console.log('connected to websocket!'))
    socket.on(
      'createMessage',
      (newMessage: any) => console.log('createMessage event received!') 
    )
    socket.on('typingMessage', ({ roomName, nickname, isTyping }) => {
      roomName === props.room.name && isTyping ? setTypingDisplay(nickname + ' is typing...')
        : setTypingDisplay('')
    })

    // Clean listeners to unsubscribe all callbacks for these events
    // before the component is unmounted
    return () => {
      socket.off('connect')
      socket.off('createMessage')
      socket.off('typingMessage')
    }
  }, [])

  // Emit that user is typing, or not typing after timeout
  let timeout
  const emitTyping = () => {
    socket.emit('typingMessage', { roomName: props.room.name, isTyping: true })
    timeout = setTimeout(() => {
      socket.emit('typingMessage', { roomName: props.room.name, isTyping: false })
    }, 2000)
  }

  // Activated whenever the user is typing on the message input field
  const onTyping = (msg: string) => {
    emitTyping()
    setMessageText(msg)
  }

  // On submit, send the nickName with the written message from the input field
  // to the backend, as a createMessage event
  const onFormSubmit = (e: any) => {
    e.preventDefault()
    if (messageText)
      socket.emit('createMessage', {
        roomName: props.room.name,
        message: {author: user.nickname, data: messageText},
      })
    // Reset input field value once sent
    setMessageText('')
  }

  // When clicking on the 'return' button
  const onReturnClick = () => {
    socket.emit('quitRoom', {
      roomName: props.room.name,
      userName: user.nickname
    })
    props.cleanRoomLoginData()
  }

  // When clicking on the 'block' button to block a user
  const onBlockClick = (target: string) => {
    user.blockedUsers.push(target)
  }


  /*************************************************************
   * Render HTML response
  **************************************************************/
  return (
      <>
        {
            <div>
              <button onClick={ onReturnClick }>return</button>
              <h2>topic: { props.room.name }</h2>
              {
                messages.length === 0 ? (<div>No Message</div>) : (
                  <div>
                    { // Mapping messages array to retrieve all messages with
                      // their corresponding authors
                      messages.map((msg, index) => (
                      <div key={ index }>
                        <p>[{ msg.author }]
                          <button onClick={ (msg) => onBlockClick }>block</button>
                          : { msg.data }</p>
                      </div>
                    ))}
                  </div>
                )
              }

              { // Display message to other users if user is currently typing
                typingDisplay && ( <div>{ typingDisplay }</div> )
              }
              
              <form onSubmit={ onFormSubmit }>
                <input type="text"
                  value={ messageText }
                  onChange={ (e) => onTyping(e.target.value) } />
                <button type="submit">Submit</button>
              </form>

            </div>
        }
      </>
      );
};

export default ChatRoom;
