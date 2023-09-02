import {
  IonAvatar,
  IonBackButton,
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
  const { isLoggedIn, logOutUser, avatar, userId } = authStore(
    (store: any) => store
  );
  const { socket } = useSocket();

  const joinRoom = () => {
    socket?.emit("join_room", room);
    setShowChat(true);
    console.log("socket connected: ", socket.connected);
  };
  const [username, setUsername] = useState<any>();
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const { data, isSuccess, isLoading, error } = useQuery<any>({
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
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
            <IonTitle>Inbox</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonFab slot="fixed" horizontal="end" edge={true}>
          {isLoggedIn ? (
            <>
              <IonFabButton size="small">
                <img src={avatar} alt="" style={{ width: "100%" }}></img>
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
              <IonContent>
                <IonRow class="ion-justify-content-center">
                  <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                    <IonCard>
                      <IonCardContent>
                        <IonSearchbar></IonSearchbar>
                        {data?.chats.map((chat: any) => (
                          <IonCard
                            key={chat._id}
                            routerLink={`/chat/${chat._id}`}
                            onClick={() => {
                              console.log("selected user", chat);
                              // router.push(`/chat/${user._id}`);
                              // joinChat(user.username);
                            }}
                          >
                            {chat?.members.map((member: any) => {
                              return (
                                <div key={member._id}>
                                  {member._id !== userId && (
                                    <IonCardContent className="ion-no-padding">
                                      <IonItem lines="none">
                                        <IonAvatar slot="start">
                                          <IonImg src={member.avatar} />
                                        </IonAvatar>
                                        <IonLabel>{member.username}</IonLabel>
                                        <IonChip slot="end" color={"primary"}>
                                          {member.phone}
                                        </IonChip>
                                      </IonItem>
                                    </IonCardContent>
                                  )}
                                </div>
                              );
                            })}
                          </IonCard>
                        ))}
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
                <IonButton className="ion-padding">Create Room</IonButton>
              </IonContent>
            </>
          ) : (
            <>
              <IonFabButton size="small">
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonFabButton>
              <IonButton routerLink="/login" expand="block">
                Login First
              </IonButton>
            </>
          )}
        </IonFab>
      </IonPage>
    </>
  );
};

export default Inbox;
