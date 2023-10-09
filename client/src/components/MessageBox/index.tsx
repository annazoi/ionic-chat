import {
  IonAvatar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { authStore } from "../../store/auth";
import "./style.css";

interface MessageConfig {
  message: any;
}

const MessageBox: React.FC<MessageConfig> = ({ message }) => {
  const { userId } = authStore((store: any) => store);
  const [timeOpen, setTimeOpen] = useState<boolean>(false);
  const [messageData, setMessageData] = useState<boolean>(false);

  const toggleTime = () => {
    setTimeOpen(!timeOpen);
  };

  const messageChoise = () => {
    setMessageData(!messageData);
  };

  // const handleTextClick = (
  //   event: React.MouseEvent<HTMLParagraphElement>,
  //   copiedMessage: any
  // ) => {
  //   event.stopPropagation(); // Stop event propagation
  //   alert(copiedMessage);
  // };

  const textRef = useRef(null);

  return (
    <>
      <IonCard
        onClick={toggleTime}
        // onClick={messageChoise}
        className={
          userId === message.senderId._id ? "sender-message" : "other-message"
        }
        style={{
          display: "flex",
          borderRadius: "25px",
        }}
      >
        <IonAvatar className="ion-avatar">
          <img src={message.senderId.avatar} alt="" />
        </IonAvatar>
        <IonCardHeader style={{ display: "grid" }}>
          <IonCardSubtitle color="dark">
            {message.senderId.username}
          </IonCardSubtitle>
          <IonCardTitle>
            <p
              onClick={(event: React.MouseEvent<HTMLParagraphElement>) => {
                event.stopPropagation(); // Stop event propagation
                alert(message.message);
              }}
            >
              {message.message}
            </p>
          </IonCardTitle>
        </IonCardHeader>
      </IonCard>

      {timeOpen && (
        <IonCardSubtitle
          className={
            userId === message.senderId._id
              ? "toggle-time-sender"
              : "toggle-time-other"
          }
          color="dark"
        >
          {message.createdAt}
        </IonCardSubtitle>
      )}
    </>
  );
};

export default MessageBox;
