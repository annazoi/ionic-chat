import {
  IonAvatar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import React, { useState } from "react";
import { authStore } from "../../store/auth";
import "./style.css";
interface MessageConfig {
  message: any;
}

const MessageBox: React.FC<MessageConfig> = ({ message }) => {
  const { userId } = authStore((store: any) => store);
  const [timeOpen, setTimeOpen] = useState<boolean>(false);

  const toggleTime = () => {
    setTimeOpen(!timeOpen);
  };

  return (
    <>
      <IonCard
        onClick={toggleTime}
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
          <IonCardTitle>{message.message}</IonCardTitle>
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
