import { SetStateAction, useContext, useEffect, useState } from "react";
import { WebSocketContext, WebSocketProvider } from "../../contexts/WebsocketContext";

// All newly created message should have an author and the message itself
type MessagePayload = {
  author: string
  data: string
}

// It takes the logged in user's profile as argument
// The messages are displayed alongside some of the profile info
const Chat = ({ user }: any) => {

  const socket = useContext(WebSocketContext)

  // Message input field value
  const [value, setValue] = useState('')
  // Array including all message objects (author + msg)
  const [messages, setMessages] = useState<MessagePayload[]>([])

  // Get all messages from messages array in chat.service and fill the messages variable
  socket.emit('findAllMessages', {}, (response: SetStateAction<MessagePayload[]>) => {
    setMessages(response)
  })

  // Add event listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to websocket!')
    })
    socket.on('createMessage', (newMessage: MessagePayload) => {
      console.log('createMessage event received!')
    })

    // Clean listeners to avoid multiple activations
    return () => {
      socket.off('connect')
      socket.off('createMessage')
    }
  }, [])

  // On submit, send the username with the written message from the input field
  // to the backend, as a createMessage event
  const onSubmit = () => {
    socket.emit('createMessage', { author: user.username, data: value})
    // Reset input field value once sent
    setValue('')
  }

  return (
    <WebSocketProvider value={socket}>

      <>
        <h1>Let's chat together right now</h1>

        <div>
          { messages.length === 0 ? (<div>No Message</div>) : (
          <div>
            { // Mapping messages array to retrieve all messages with their corresponding authors
              messages.map((msg) => (
              <div>
                <p>{msg.author }: { msg.data }</p>
              </div>
            ))}
            </div>
            )}
        </div>

        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />

        <button onClick={onSubmit}>Submit</button>
      </>
    
    </WebSocketProvider>
  );
};

export default Chat;
