import { useQuery } from "@tanstack/react-query";
import { UserConfig } from "../../validations-schemas/interfaces/user";
import { getUsers } from "../../services/users";

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonIcon,
  IonAvatar,
  IonItem,
  IonLabel,
  IonImg,
  IonChip,
} from "@ionic/react";
import React, { useState } from "react";
import { useSocket } from "../../hooks/sockets";
import Chat from "../chat/Chat";
import { authStore } from "../../store/auth";

const Users: React.FC = () => {
  const { userId } = authStore((store: any) => store);

  const { data, isSuccess } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  // const usersQuery = useQuery(["users"], getUsers);
  // const userQuery = useQuery(["user", userId], () => getUser(userId));

  const [chatId, setChatId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const { socket } = useSocket();

  // const joinChat = (userId: any) => {
  //   socket?.emit("join_chat", chatId);
  //   setUsername(userId);
  //   setChatId(chatId);
  //   setShowChat(true);
  //   console.log("socket connected: ", socket.connected);
  // };

  isSuccess && console.log("all users", data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Contacts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent></IonContent>
    </IonPage>
  );
};

export default Users;
