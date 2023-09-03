import {
  IonAvatar,
  IonButton,
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
import { addCircle, globe, logOut, settings } from "ionicons/icons";
import { getChats } from "../../services/chat";
import React from "react";
import Users from "../../components/Users";
import Modal from "./Modal";
import Settings from "./Settings";

const Inbox: React.FC = () => {
  const {
    logOutUser,
    avatar,
    userId,
    username: usernameStore,
  } = authStore((store: any) => store);
  const { socket } = useSocket();

  const joinRoom = () => {
    socket?.emit("join_room", room);
    setShowChat(true);
    console.log("socket connected: ", socket.connected);
  };
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const { data, isSuccess, isLoading, error } = useQuery<any>({
    queryKey: ["chats"],
    queryFn: () => getChats(),
    onSuccess: (data: any) => {
      {
        data?.chats.map((chat: any) => {
          console.log("chat", chat);
          socket?.emit("join_room", chat._id);
        });
      }
    },
  });

  const handleLogout = () => {
    logOutUser();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{usernameStore}'s Inbox</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonFab slot="fixed" horizontal="end" edge={true}>
        <IonFabButton size="small">
          <img src={avatar} alt="" style={{ width: "100%" }}></img>
        </IonFabButton>
        <IonFabList side="bottom">
          <IonFabButton
            onClick={() => {
              setOpenSettings(true);
            }}
          >
            <IonIcon icon={settings}></IonIcon>
          </IonFabButton>

          <IonFabButton routerLink="/login" onClick={handleLogout}>
            <IonIcon icon={logOut}></IonIcon>
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={globe}></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>
      <IonContent>
        {data?.chats.map((chat: any) => (
          <IonCard
            key={chat._id}
            routerLink={`/chat/${chat._id}`}
            onClick={() => {
              console.log("selected user", chat);
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
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton
            size="small"
            onClick={() => {
              setOpenSearch(true);
            }}
          >
            <img src={addCircle} alt="" style={{ width: "100%" }}></img>
          </IonFabButton>
        </IonFab>
      </IonContent>

      <Modal
        isOpen={openSearch}
        onClose={setOpenSearch}
        title="Find Contact"
        component={Users}
      ></Modal>

      <Modal
        isOpen={openSettings}
        onClose={setOpenSettings}
        title="Settings"
        component={Settings}
      ></Modal>
    </IonPage>
  );
};

export default Inbox;
