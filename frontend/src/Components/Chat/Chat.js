import React, { useEffect, useRef, useCallback, useContext, useState, } from "react";
import { Row, Col } from "react-bootstrap";
import { ChatContext } from "./ChatContext";

const Message = ({ message, localClientName }) => {
  return (
    <li
      key={message.id}
      className={`msgItem mb-1 ${
        message.clientName === localClientName ? "right" : "left"
      }`}
    >
      <p
        className={`m-0 mb-1 clientNameDate ${
          message.clientName === localClientName ? "right" : "left"
        }`}
      >
        <span className="clientName"> {message.clientName} </span>
        <span className="chatTimeStamp">{message.time} </span>
      </p>
      <p
        className={`msg m-0 ${
          message.clientName === localClientName ? "right" : "left"
        }`}
      >
        {message.message}
      </p>
    </li>
  );
};

const Chat = ({ socket, accessKey, localClientName, isModalOpen}) => {
    const [messages, setMessages] = useState([]); //track messages

  // const [renderTrigger, setRenderTrigger] = useState(false);
  const messagesRef = useRef([]); // Use ref to store messages
  const { addMessage, messages: contextMessages } = useContext(ChatContext);
//   const { messages, setMessages } = useChat(); // Use the chat context
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const counter = useRef(0);
  const messagesEndRef = useRef(null); // Ref to track the end of the messages list

  useEffect(() => {
    const form = formRef.current;
    const input = inputRef.current;

    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (input.value !== "") {
        const clientOffset = `${socket.id}-${counter.current++}`;
        socket.emit("chat message", {
          msg: input.value,
          clientOffset: clientOffset,
          roomAccessKey: accessKey,
          clientName: localClientName,
        });
        input.focus();
        input.value = "";
      }
    };

    if (form) {
      form.addEventListener("submit", handleFormSubmit);
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", handleFormSubmit);
      }
    };
  }, [socket, accessKey, localClientName]);

  let getTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

//   useEffect(() => {
//     handleChatMsg = async (data) => {
//       const { msg, serverOffset, clientName } = await data;
//       console.log(serverOffset, clientName, msg);
//       //  let msgWrapper = document.getElementById("messages");

//       // Create a new message object
//       const newMessage = {
//         id: serverOffset, // Assuming serverOffset can be used as a unique identifier
//         clientName,
//         message: msg,
//         time: getTime(),
//       };

//       try {
//         messagesRef.current = [...messagesRef.current, newMessage];
//         setRenderTrigger((prev) => !prev); // Trigger re-render

//         window.scrollTo(0, document.body.scrollHeight);
//         // socketRef.current.auth.serverOffset = serverOffset;
//         //   setMessages((prevMessages) => [...prevMessages, newMessage]);
//       } catch (e) {
//         console.log("messages not sent", e);
//       }
//       // Update messages state with the new message
//     };
//   }),[messagesRef.current];

let handleChatMsg;
  useEffect(() => {
 handleChatMsg = (data) => {
    const { msg, serverOffset, clientName } = data;
    const newMessage = {
      id: serverOffset,
      clientName,
      message: msg,
      time: getTime(),
    };
    // setMessages((prevMessages) => [...prevMessages, newMessage]);
    addMessage(newMessage); // Update the context with the new message
}
  }, [setMessages]);

  useEffect(() => {
    if (socket) {
      socket.on("chat message", handleChatMsg);
    }
    return () => {
      if (socket) {
        socket.off("chat message", handleChatMsg);
      }
    };
  }, [socket, handleChatMsg]);

   // Scroll to the bottom of the chat when messages change
   useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [contextMessages]);

  // Focus on input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);


  return (
    <div id={`chat-container`}>
      <h2 className="p-3 chat-title mb-0">Chat</h2>
      <ul id="messages" className="p-3 chat-messages">
        {contextMessages.map((message) => (
          <Message
            key={message.id}
            message={message}
            localClientName={localClientName}
          />
        ))}
         <div ref={messagesEndRef} />
      </ul>
      <form id="form" ref={formRef} action="" className="">
        <Row id="sendMsgRow" className="p-0 m-0">
          <Col xs={11} className="p-0">
            <input
              ref={inputRef}
              placeholder="Nachricht absenden"
              title="message area"
              id="msgInput"
              className="border-0 p-2"
              autoComplete="off"
            />
          </Col>
          <Col xs={1} className="p-0">
            <button
              type="submit"
              id="sendMsgBtn"
              title="send message button"
              className="sendMsgBtn btn"
            >
              <img src="/icons/send-chat-msg.svg"></img>
            </button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default Chat;
