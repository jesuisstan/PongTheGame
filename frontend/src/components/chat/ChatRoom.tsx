import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { WebSocketContext } from "../../contexts/WebsocketContext";
import { MemberType, Message } from "../../types/chat";

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
  // Array including all message objects (author + msg) excluding
  // messages from blocked users/users who blocked the user
  const [messages, setMessages] = useState<Message[]>([])
  // Display typing state of the user
  const [typingDisplay, setTypingDisplay] = useState<string>('')
  // Message input field value
  const [messageText, setMessageText] = useState<string>('')
  // Checks if the user is oper(=admin) in the chat room
  const [isOper, setIsOper] = useState<boolean>(false)
  // Array including all members
  const [members, setMembers] = useState<MemberType[]>([])


  socket.emit('findAllMembers', { roomName: props.roomName },
    (response: MemberType[]) => {
      setMembers(response)
    }
  )

  // Get all messages from messages array in chat.service
  // and fill the messages variable
  socket.emit('findAllMessages',
    { roomName: props.roomName },
    (response: Message[]) => {
      // Array including all the messages, even the ones from
      // blocked users/users who blocked the user
      const messagesToFilter = response

      for (let i = messagesToFilter.length - 1; i >= 0; --i) {
        // First we filter the recipient's blocked users
        let found = false;
        for (const blockedUser in user.blockedUsers) {
          if (messagesToFilter[i].author.nickname === user.blockedUsers[blockedUser])
          {
            messagesToFilter.splice(i, 1);
            found = true;
            break;
          }
        }
        // Then we filter the sender's blocked users
        if (found === false) {
          for (const blockedUser in messagesToFilter[i].author.blockedUsers) {
            if (user.nickname === messagesToFilter[i].author.blockedUsers[blockedUser])
            {
              messagesToFilter.splice(i, 1);
              break;
            }
          }
        }
      }
      const filteredMessages = messagesToFilter
      setMessages(filteredMessages)
    })

    socket.emit('isUserOper',
      { roomName: props.roomName, nick: user.nickname },
      (response: boolean) => {
        setIsOper(response)
      }
    )


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
    socket.on('typingMessage', (
        roomName: string, nick: string, isTyping: boolean) => {
      roomName === props.roomName && isTyping ?
        setTypingDisplay(nick + ' is typing...')
        : setTypingDisplay('')
    })
    socket.on('removePassword', (roomName: string) => {
      if (roomName === props.roomName)
        console.log('Password from ' + roomName + ' has been removed!')
    })
    socket.on('makeOper', (roomName: string, target: string) => {
      if (roomName === props.roomName)
        console.log(target + ' is Oper now!')
    })
    socket.on('joinRoom', (roomName: string, nick: string) => {
      if (roomName === props.roomName)
        console.log(nick + ' joined chatroom [' + roomName + ']');
    });
    socket.on('quitRoom', (roomName: string, nick: string) => {
      if (roomName === props.roomName)
        console.log(nick + ' quit room [' + roomName + ']')
    });
    socket.on('kickUser', (roomName: string, target: string) => {
      if (roomName === props.roomName)
        console.log(target + ' has been kicked!')
      if (target === user.nickname) props.cleanRoomLoginData()
    });
      socket.on('banUser', (roomName: string, target: string) => {
      if (roomName === props.roomName)
        console.log(target + ' has been banned!')
      if (target === user.nickname) props.cleanRoomLoginData()
    })
    socket.on('unBanUser', (roomName: string, target: string) => {
      if (roomName === props.roomName)
        console.log(target + ' has been unbanned!')
    })

    // Clean listeners to unsubscribe all callbacks for these events
    // before the component is unmounted
    return () => {
      socket.off('connect')
      socket.off('createMessage')
      socket.off('typingMessage')
      socket.off('removePassword')
      socket.off('makeOper')
      socket.off('joinRoom')
      socket.off('quitRoom')
      socket.off('kickUser')
      socket.off('banUser')
      socket.off('unBanUser')
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

  // const checkIfBlocked = (target: string) => {
  //   for (const blockedUser in user.blockedUsers)
  //     if (target === user.blockedUsers[blockedUser])
  //       return true
  //   return false
  // }

  // When clicking on the 'block' button to block a user
  const onBlockClick = (target: string) => {
    user.blockedUsers.push(target)
  }
  // When clicking on the 'unblock' button to unblock a user
  const onUnBlockClick = (target: string) => {
    for (var i=0; i < user.blockedUsers.length; ++i)
      if (user.blockedUsers[i] === target)
      {
        user.blockedUsers.splice(i, 1)
        break
      }
  }

  // When clicking on the 'ban' button to ban a user
  const onBanClick = (target: string) => {
    socket.emit('banUser', {
      roomName: props.roomName,
      nick: user.nickname,
      target: target
    })
  }
  // When clicking on the 'unban' button to unban a user
  const onUnBanClick = (target: string) => {
    socket.emit('unBanUser', {
      roomName: props.roomName,
      nick: user.nickname,
      target: target
    })  
  }

  const isUserBanned = (nick: string) => {
    socket.emit('isUserBanned', {
      roomName: props.roomName,
      nick: nick
    }, (response: boolean) => {
      return response
    })
  }
  
  // When clicking on the 'kick' button to kick a user
  const onKickClick = (target: string) => {
    socket.emit('kickUser', {
      roomName: props.roomName,
      nick: user.nickname,
      target: target
    })
  }

    // When clicking on the 'oper' button to make a user oper
    const onMakeOperClick = (target: string) => {
      socket.emit('makeOper', {
        roomName: props.roomName,
        nick: user.nickname,
        target: target
      })  
    }


  /*************************************************************
   * Render HTML response
  **************************************************************/
  return (
      <>
        {
            <div>
              <button onClick={ onReturnClick }>return</button>

              <ul>
                { // Members' list
                  Object.keys(members).map((nick, index) => (
                      <li key={ index }>
                        <>
                          { // Nickname of the member preceeded by its online status
                            members[nick as any].isOnline ? '*' : '' } { nick }

                          { // Displays if member is oper
                            String(members[nick as any].modes).search('o') !== -1 ?
                              ' (admin)' : '' }

                          { // If user is oper(=admin), the button to users oper is displayed 
                            isOper && (user.nickname !== nick) &&
                              String(members[nick as any].modes).search('o') === -1 &&
                            <button onClick={ () => onMakeOperClick(nick) }>
                              oper
                            </button>
                          }                          
                          
                          { // If user is oper(=admin), the button to kick users is displayed 
                            isOper && (user.nickname !== nick) &&
                              String(members[nick as any].modes).search('o') === -1 &&
                            <button onClick={ () => onKickClick(nick) }>
                              kick
                            </button>
                          }
                          
                          { // If user is oper(=admin), the button to ban users is displayed 
                            isOper && (user.nickname !== nick) &&
                              String(members[nick as any].modes).search('o') === -1 &&
                            <button onClick={ () => onBanClick(nick) }>
                              ban
                            </button>
                          }
                          { // If user is oper(=admin), the button to unban users is displayed 
                            isOper && (user.nickname !== nick) &&
                            String(members[nick as any].modes).search('o') === -1 &&
                            <button onClick={ () => onUnBanClick(nick) }>
                              unban
                            </button>
                          }
                          
                          { // Block button appears if the author of the message
                            // is not the user himself
                            (user.nickname !== nick) &&
                              <button onClick={ () => onBlockClick(nick) }>
                                block
                              </button>
                          }

                          { // Unblock button appears if the author of the message
                            // is not the user himself
                            (user.nickname !== nick) &&
                              <button onClick={ () => onUnBlockClick(nick) }>
                                unblock
                              </button>
                          }
                        </>
                      </li>
                  ))
                }
              </ul>

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
                          [{ msg.author.nickname }] : { msg.data }
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
