import { useQuery } from "@tanstack/react-query";
import { UserConfig } from "../../validations-schemas/interfaces/user";
import { getUser, getUsers } from "../../services/users";

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
import { is } from "date-fns/locale";
import { useSocket } from "../../hooks/sockets";
import Chat from "../chat/Chat";
import { set } from "date-fns";
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

  const joinChat = (userId: any) => {
    socket?.emit("join_chat", chatId);
    setUsername(userId);
    setChatId(chatId);
    setShowChat(true);
    console.log("socket connected: ", socket.connected);
  };

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
      <IonContent>
        {!showChat ? (
          <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <IonCard>
                <IonCardContent>
                  <IonSearchbar></IonSearchbar>
                  {isSuccess &&
                    data?.users.map((user: UserConfig) => (
                      <IonCard
                        key={user._id}
                        // routerLink={`/chat/${user._id}`}
                        onClick={() => {
                          console.log("selected user", user);
                          joinChat(user.username);
                        }}
                      >
                        <IonCardContent className="ion-no-padding">
                          <IonItem lines="none">
                            <IonAvatar slot="start">
                              <IonImg src={user.avatar} />
                            </IonAvatar>
                            <IonLabel>{user.username}</IonLabel>
                            <IonChip slot="end" color={"primary"}>
                              {user.phone}
                            </IonChip>
                          </IonItem>
                        </IonCardContent>
                      </IonCard>
                    ))}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        ) : (
          <Chat username={username} room={chatId} socket={socket} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Users;
