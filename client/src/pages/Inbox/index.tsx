import {
  IonAvatar,
  IonButton,
  IonButtons,
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
import { useState } from "react";
import { create, globe, logOut, people, settings, sync } from "ionicons/icons";
import { getChats } from "../../services/chat";
import React from "react";
import Users from "./CreateChat";
import Modal from "./Modal";
import Settings from "./Settings";
import Loading from "../../components/Loading";
import { arrowForward } from "ionicons/icons";
import { useSocket } from "../../hooks/sockets";

const Inbox: React.FC = () => {
  const {
    logOutUser,
    avatar,
    userId,
    username: usernameStore,
  } = authStore((store: any) => store);

  const [openCreateChat, setOpenCreateChat] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const { socket } = useSocket();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["chats"],
    queryFn: getChats,
    refetchOnMount: "always",
  });

  const joinRoom = (chatId: string) => {
    socket.emit("join_room", chatId);
  };

  const handleLogout = () => {
    logOutUser();
  };

  const refresh = () => {
    window.location.reload();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{usernameStore}'s inbox</IonTitle>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                refresh();
              }}
            >
              <IonIcon icon={sync}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonFab slot="fixed" horizontal="end" edge={true}>
        <IonFabButton size="small">
          <img src={avatar} alt="" style={{ borderRadius: "50px" }}></img>
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
                      className="ion-no-margin ion-no-padding"
                      routerLink={`/chat/${chat._id}`}
                      onClick={() => {
                        console.log("selected chat", chat);
                        joinRoom(chat._id);
                      }}
                    >
                      {chat.members.map((member: any, index: any) => {
                        return (
                          <div key={index}>
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
                        joinRoom(chat._id);
                      }}
                    >
                      <IonItem lines="none">
                        <IonAvatar slot="start">
                          {!chat.avatar ? (
                            <IonIcon size={"large"} icon={people}></IonIcon>
                          ) : (
                            <IonImg src={chat.avatar} />
                          )}
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
              setOpenCreateChat(true);
            }}
          ></IonIcon>
        </IonFab>
      </IonContent>

      <Modal
        isOpen={openCreateChat}
        onClose={setOpenCreateChat}
        title="New Message"
        closeModal={() => {
          setOpenCreateChat(false);
        }}
      >
        <Users
          closeModal={() => {
            setOpenCreateChat(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={openSettings}
        onClose={setOpenSettings}
        title="Settings"
        closeModal={() => {
          setOpenSettings(false);
        }}
      >
        <Settings />
      </Modal>
    </IonPage>
  );
};

export default Inbox;
