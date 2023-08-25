import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";
import { authStore } from "../../store/auth";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/users";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../../constants";
import { useSocket } from "../../hooks/sockets";
import { useEffect, useState } from "react";
import { Route } from "react-router";
import Chat from "../../components/chat/Chat";
import {
  chevronDownCircle,
  chevronForwardCircle,
  colorPalette,
  globe,
  logOut,
  settings,
} from "ionicons/icons";

const Inbox: React.FC = () => {
  const { isLoggedIn, userId, logOutUser } = authStore((store: any) => store);
  const { socket } = useSocket();

  const joinRoom = () => {
    socket?.emit("join_room", room);
    setShowChat(true);
    console.log("socket connected: ", socket.connected);
  };
  const [username, setUsername] = useState<any>();
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const { data, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(userId),
  });

  if (isSuccess) {
    console.log("data", data);
  }

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
                <img src={data?.user.avatar} alt=""></img>
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
          {!showChat ? (
            <div className="joinChatContainer">
              <h3>Join A Chat</h3>
              <IonInput
                type="text"
                placeholder="Username..."
                onIonChange={(event: any) => {
                  setUsername(event.target.value);
                }}
              />
              <IonInput
                type="text"
                placeholder="Room ID..."
                onIonChange={(event: any) => {
                  setRoom(event.target.value);
                }}
              />
              <IonButton className="ion-padding" onClick={joinRoom}>
                Join A Room
              </IonButton>
            </div>
          ) : (
            <Chat socket={socket} username={username} room={room} />
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Inbox;
