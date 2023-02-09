// import { useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

import userEvent from "@testing-library/user-event";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { socket, WebSocketContext, WebSocketProvider } from "../../contexts/WebsocketContext";

type MessagePayload = {
  author: string
  data: string
}

const Chat = ({ user }: any) => {

  const socket = useContext(WebSocketContext)

  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<MessagePayload[]>([])

  // Get all messages from messages array in chat.service and fill the messages variable
  socket.emit('findAllMessages', {}, (response: SetStateAction<MessagePayload[]>) => {
    setMessages(response)
  })

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to websocket!')
    })
    socket.on('createMessage', (newMessage: MessagePayload) => {
      console.log('createMessage event received: ' + newMessage.data)
    })

    return () => {
      socket.off('connect')
      socket.off('createMessage')
    }
  }, [])

  const onSubmit = () => {
    socket.emit('createMessage', { author: user.username, data: value})
    setValue('')
  }

  return (
    <WebSocketProvider value={socket}>

      <>
        <h1>Let's chat together right now</h1>

        <div>
          { messages.length === 0 ? (<div>No Message</div>) : (
          <div>
            { messages.map((msg) => (
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
