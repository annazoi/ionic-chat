import ExploreContainer from "../ExploreContainer";
import { authStore } from "../../store/auth";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/users";
import { Socket } from "socket.io-client";
import { API_URL } from "../../constants";
import { useEffect, useState } from "react";
import React from "react";
// import { ChatConfig } from "../../validations-schemas/interfaces/chat";
import { IonButton, IonContent } from "@ionic/react";

const Chat = ({ username, room, socket }: any) => {
  const { isLoggedIn, userId } = authStore((store: any) => store);

  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<any>([]);

  const { data, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(userId),
  });

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket?.emit("send_message", messageData);
      setMessageList((list: any) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      setMessageList((list: any) => [...list, data]);
    });
  }, [socket]);

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <div>
        <p>Live Chat</p>
      </div>
      <div>
        {messageList.map((messageContent: any, index: any) => {
          return (
            <div
              key={index}
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div>
                  <p>{messageContent.message}</p>
                </div>
                <div>
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <IonButton onClick={sendMessage}>&#9658;</IonButton>
      </div>
    </div>
  );
};

export default Chat;
