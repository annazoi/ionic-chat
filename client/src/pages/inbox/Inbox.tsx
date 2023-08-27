import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { authStore } from "../../store/auth";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../../hooks/sockets";
import { useState } from "react";
import { globe, logOut, settings } from "ionicons/icons";
import { getChats } from "../../services/chat";
import { ChatConfig } from "../../validations-schemas/interfaces/chat";
import React from "react";

const Inbox: React.FC = () => {
  const { isLoggedIn, logOutUser, avatar } = authStore((store: any) => store);
  const { socket } = useSocket();

  const joinRoom = () => {
    socket?.emit("join_room", room);
    setShowChat(true);
    console.log("socket connected: ", socket.connected);
  };
  const [username, setUsername] = useState<any>();
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const { data, isSuccess, isLoading } = useQuery<any>({
    queryKey: ["chats"],
    queryFn: () => getChats(),
  });
  isSuccess && console.log("chats", data);

  const handleLogout = () => {
    logOutUser();
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Inbox</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonFab slot="fixed" horizontal="end" edge={true}>
          {isLoggedIn && isLoggedIn ? (
            <>
              <IonFabButton size="small">
                <img src={avatar} alt=""></img>
              </IonFabButton>
              <IonFabList side="bottom">
                <IonFabButton>
                  <IonIcon icon={settings}></IonIcon>
                </IonFabButton>
                <IonFabButton routerLink="/login" onClick={handleLogout}>
                  <IonIcon icon={logOut}></IonIcon>
                </IonFabButton>
                <IonFabButton>
                  <IonIcon icon={globe}></IonIcon>
                </IonFabButton>
              </IonFabList>
            </>
          ) : (
            <IonFabButton size="small">
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonFabButton>
          )}
        </IonFab>

        <IonContent>
          {isLoggedIn && (
            <>
              <IonRow class="ion-justify-content-center">
                <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                  <IonCard>
                    <IonCardContent>
                      <IonSearchbar></IonSearchbar>
                      {isSuccess &&
                        data?.chats.map((chat: any) => (
                          <IonCard
                            key={chat._id}
                            routerLink={`/chat/${chat._id}`}
                            onClick={() => {
                              console.log("selected user", chat);
                              // router.push(`/chat/${user._id}`);
                              // joinChat(user.username);
                            }}
                          >
                            <IonCardContent className="ion-no-padding">
                              <IonItem lines="none">
                                <IonAvatar slot="start">
                                  <IonImg src={chat.creatorId.avatar} />
                                </IonAvatar>
                                <IonLabel>{chat.username}</IonLabel>
                                <IonChip slot="end" color={"primary"}>
                                  {/* {chat.phone} */}
                                </IonChip>
                              </IonItem>
                            </IonCardContent>
                          </IonCard>
                        ))}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonButton className="ion-padding">Create Room</IonButton>
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Inbox;

{
}
