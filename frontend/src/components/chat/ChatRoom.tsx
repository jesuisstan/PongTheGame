import { SetStateAction, useContext, useEffect, useState } from "react";
import { WebSocketContext, WebSocketProvider } from "../../contexts/WebsocketContext";

// // All newly created message should have an author and the message itself
// export type MessagePayload = {
// 	author: string
// 	data: string
// }

// It takes the logged in user's profile as argument
// The messages are displayed alongside some of the profile info
const ChatRoom = (props: any) => {

  const socket = useContext(WebSocketContext)

  // Array including all message objects (author + msg)
  const [messages, setMessages] = useState<any[]>([])
  // Tells whether the user has joined the chatroom
  const [joined, setJoined] = useState<boolean>(true)
  // Display typing state of the user
  const [typingDisplay, setTypingDisplay] = useState<string>('')
  
  // Message input field value
  const [messageText, setMessageText] = useState<string>('')

  // Get all messages from messages array in chat.service and fill the messages variable
  socket.emit('findAllMessages', {}, (response: SetStateAction<any[]>) => {
    setMessages(response)
  })

  // Add event listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to websocket!')
    })
    socket.on('createMessage', (newMessage: any) => {
      console.log('createMessage event received!')
    })
    socket.on('typingMessage', ({ nickname, isTyping }) => {
      isTyping ? setTypingDisplay(nickname + ' is typing...')
        : setTypingDisplay('')
    })

    // Clean listeners to avoid multiple activations
    return () => {
      socket.off('connect')
      socket.off('createMessage')
      socket.off('typingMessage')
    }
  }, [])

  // Emit that user is typing, or not typing after timeout
  let timeout
  const emitTyping = () => {
    socket.emit('typingMessage', { room: props.room, isTyping: true })
    timeout = setTimeout(() => {
      socket.emit('typingMessage', { room: props.room, isTyping: false })
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
      socket.emit('createMessage', { author: props.user.nickname, data: messageText})
    // Reset input field value once sent
    setMessageText('')
  }

  return (
      <>
          { 
            !joined ? (
                <div></div>
            ) : (
              <div>
                {
                  messages.length === 0 ? (<div>No Message</div>) : (
                    <div>
                      { // Mapping messages array to retrieve all messages with
                        // their corresponding authors
                        messages.map((msg) => (
                        <div>
                          <p>[{ msg.author }]: { msg.data }</p>
                        </div>
                      ))}
                    </div>
                 )
                }

                { // Display message to other users if user is currently typing
                  typingDisplay && (
                    <div>{ typingDisplay }</div>
                  )
                }
                
                <form onSubmit={ onFormSubmit }>
                  <input type="text"
                    value={ messageText }
                    onChange={ (e) => onTyping(e.target.value) } />

                  <button type="submit">Submit</button>
                </form>

              </div>
            )
          }
      </>
      );
};

export default ChatRoom;
