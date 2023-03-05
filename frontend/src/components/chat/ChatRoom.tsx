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
  // Checks if the user is oper(=admin) in the chat room
  const [isOper, setIsOper] = useState<boolean>(false)

  // Get all messages from messages array in chat.service and fill the messages variable
  socket.emit('findAllMessages',
    { roomName: props.roomName },
    (response: SetStateAction<Message[]>) => {
      // Messages are unfiltered yet
      setMessagesToFilter(response)

      messagesToFilter.forEach((msg, index, object) => {
        // First we filter the recipient's blocked users
        for (const blockedUser in user.blockedUsers)
          if (msg.author.nickname === blockedUser)
            object.slice(index, 1)
        // Then we filter the sender's blocked users
        for (const blockedUser in msg.author.blockedUsers)
        if (user.nickname === blockedUser)
          object.slice(index, 1)  
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
    socket.on('typingMessage', ({ roomName, nick, isTyping }) => {
      roomName === props.roomName && isTyping ? setTypingDisplay(nick + ' is typing...')
        : setTypingDisplay('')
    })
    socket.on('removePassword', ({ roomName }) => {
      console.log('Password from ' + roomName + ' has been removed!')
    })
    socket.on('makeOper', ({ roomName, nick }) => {
      console.log(nick + ' is Oper now!')
    })
    socket.on('banUser', ({ roomName, nick }) => {
      console.log(nick + ' has been banned!')
    })
    socket.on('kickUser', ({ roomName, nick }) => {
      console.log(nick + ' has been kicked!')
    })

    // Clean listeners to unsubscribe all callbacks for these events
    // before the component is unmounted
    return () => {
      socket.off('connect')
      socket.off('createMessage')
      socket.off('typingMessage')
      socket.off('removePassword')
      socket.off('makeOper')
      socket.off('banUser')
      socket.off('kickUser')
    }
  }, [])

  // Emit that user is typing, or not typing after timeout
  let timeout
  const emitTyping = () => {
    socket.emit('typingMessage', { 
      roomName: props.roomName, nickname: user.nickname, isTyping: true
    })
    timeout = setTimeout(() => {
      socket.emit('typingMessage', {
        roomName: props.roomName, nickname: user.nickname, isTyping: false
      })
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
        roomName: props.roomName,
        message: {author: user, data: messageText},
      })
    // Reset input field value once sent
    setMessageText('')
  }

  // When clicking on the 'return' button
  const onReturnClick = () => {
    socket.emit('quitRoom', {
      roomName: props.roomName,
      nick: user.nickname
    })
    props.cleanRoomLoginData()
  }

  // When clicking on the 'block' button to block a user
  const onBlockClick = (msg: Message) => {
    user.blockedUsers.push(msg.author.nickname)
  }

  // When clicking on the 'ban' button to ban a user
   const onBanClick = (target: string) => {

  }


  /*************************************************************
   * Render HTML response
  **************************************************************/
  return (
      <>
        {
            <div>
              <button onClick={ onReturnClick }>return</button>
              <h2>topic: { props.roomName }</h2>
              {
                messages.length === 0 ? (<div>No Message</div>) : (
                  <div>
                    { // Mapping messages array to retrieve all messages with
                      // their corresponding authors
                      messages.map((msg, index) => (
                      <div key={ index }>
                        <p>
                          <>
                          [{ msg.author.nickname }]
                          { // If user is oper(=admin), the button to ban users is displayed 
                            isOper && <button onClick={ (msg) => onBanClick }>ban</button>
                          }
                          
                          { // Block button appears if the author of the message
                            // is not the user himself
                            (user.nickname !== msg.author.nickname)
                              && <button onClick={ (msg) => onBlockClick }>block</button>
                          }
                          : { msg.data }
                          </>
                        </p>
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
