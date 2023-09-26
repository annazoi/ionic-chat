import {
  IonAvatar,
  IonCard,
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { authStore } from "../../store/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addCircle, create, globe, logOut, settings } from "ionicons/icons";
import { getChats } from "../../services/chat";
import React from "react";
import Users from "../../components/Users";
import Modal from "./Modal";
import Settings from "./Settings";
import Loading from "../../components/Loading";
import { arrowForward } from "ionicons/icons";
import Group from "../../components/Group";
import { useSocket } from "../../hooks/sockets";

const Inbox: React.FC = () => {
  const {
    logOutUser,
    avatar,
    userId,
    username: usernameStore,
  } = authStore((store: any) => store);

  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const { socket } = useSocket();

  const getAllChats = async () => {
    await getChats();
  };

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["chats"],
    queryFn: () => getChats(),
    onSuccess: (res: any) => {
      // getAllChats();
      console.log("chats", res.chats);
      setChats(res.chats);
    },
  });

  const join_room = (chatId: string) => {
    socket.emit("join_room", chatId);
  };

  const handleLogout = () => {
    logOutUser();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{usernameStore}'s inbox</IonTitle>
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
      <IonContent className="ion-padding">
        {isLoading && <Loading showLoading={isLoading} />}
        {data?.chats?.length === 0 ? (
          <IonCard>
            <IonItem>
              <IonLabel>
                You have no chats yet. Click the button below to find a contact.
              </IonLabel>
            </IonItem>
          </IonCard>
        ) : (
          <>
            {data?.chats?.map((chat: any, index: any) => {
              return (
                <div key={index}>
                  {chat.type === "private" ? (
                    <IonCard
                      className="ion-no-margin"
                      routerLink={`/chat/${chat._id}`}
                      onClick={() => {
                        console.log("selected chat", chat);
                        join_room(chat._id);
                      }}
                    >
                      {chat.members.map((member: any) => {
                        return (
                          <div key={member._id}>
                            {member._id !== userId && (
                              <IonItem lines="none">
                                <IonAvatar slot="start">
                                  <IonImg src={member.avatar} />
                                </IonAvatar>
                                <IonLabel>{member.username}</IonLabel>
                                <IonIcon icon={arrowForward}></IonIcon>
                              </IonItem>
                            )}
                          </div>
                        );
                      })}
                    </IonCard>
                  ) : (
                    <IonCard
                      className="ion-no-margin"
                      routerLink={`/chat/${chat._id}`}
                      onClick={() => {
                        console.log("selected chat", chat);
                      }}
                    >
                      <IonItem lines="none">
                        <IonAvatar slot="start">
                          <IonImg src={chat.avatar} />
                        </IonAvatar>
                        <IonLabel>{chat.name}</IonLabel>
                        <IonIcon icon={arrowForward}></IonIcon>
                      </IonItem>
                    </IonCard>
                  )}
                </div>
              );
            })}
          </>
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonIcon
            icon={create}
            size="large"
            onClick={() => {
              setOpenSearch(true);
            }}
          ></IonIcon>
        </IonFab>
      </IonContent>

      <Modal
        isOpen={openSearch}
        onClose={setOpenSearch}
        title="New Message"
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
