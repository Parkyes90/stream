import React, { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../../../../index";

type Message = {
  username: string;
  message: string;
};

const Chat: React.FC = () => {
  const [state, setState] = useState<Message>({
    username: "",
    message: "",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    socket.on("broadcastMessage", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);
  return (
    <div>
      {messages.map((message, index) => {
        return (
          <div key={index}>
            <div>
              {message.username}: {message.message}
            </div>
          </div>
        );
      })}

      <form
        onSubmit={(e) => {
          const { username, message } = state;
          e.preventDefault();
          socket.emit("sendingMessage", {
            message,
            username,
          });
          setState((prevState) => ({ ...prevState, message: "" }));
        }}
      >
        <input
          type="text"
          name="username"
          placeholder="사용자"
          onChange={onChange}
          value={state.username}
        />
        <input
          type="text"
          name="message"
          placeholder="내용"
          onChange={onChange}
          value={state.message}
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default Chat;
