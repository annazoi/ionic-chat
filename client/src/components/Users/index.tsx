import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/users";

import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonRow,
  IonSearchbar,
  IonAvatar,
  IonItem,
  IonLabel,
  IonImg,
  IonChip,
} from "@ionic/react";
import React from "react";
import { useSocket } from "../../hooks/sockets";
import Chat from "../Chat";
import { authStore } from "../../store/auth";
import { useParams } from "react-router";
const Users: React.FC = () => {
  const { userId, isLoggedIn } = authStore((store: any) => store);

  const { data, isSuccess } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const { socket } = useSocket();
  const { chatId } = useParams<{ chatId: string }>();

  // const joinChat = (userId: any) => {
  //   socket?.emit("join_chat", chatId);
  //   setUsername(userId);
  //   setChatId(chatId);
  //   setShowChat(true);
  //   console.log("socket connected: ", socket.connected);
  // };

  isSuccess && console.log("all users", data);

  return (
    <IonContent>
      {isLoggedIn && (
        <>
          <IonCardContent>
            <IonSearchbar></IonSearchbar>
            {isSuccess &&
              data?.users.map((user: any) => (
                <IonCard
                  key={user._id}
                  routerLink={`/chat/${chatId}`}
                  onClick={() => {
                    console.log("selected user", user);
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
        </>
      )}
    </IonContent>
  );
};

export default Users;
