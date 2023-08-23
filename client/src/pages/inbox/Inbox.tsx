import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
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

const Inbox: React.FC = () => {
  const { isLoggedIn, userId } = authStore((store: any) => store);
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

  // if (isSuccess) {
  //   console.log("data", data);
  // }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inbox</IonTitle>
          {isLoggedIn && isLoggedIn ? (
            <IonButtons slot="end">
              <IonAvatar class="ion-padding">
                {<img src={data?.user.avatar} alt="" />}
              </IonAvatar>
            </IonButtons>
          ) : (
            <IonButtons slot="end">
              <IonAvatar class="ion-padding">
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
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
  );
};

export default Inbox;
