import {
  IonAvatar,
  IonButton,
  IonCard,
  IonChip,
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
import { useSocket } from "../../hooks/sockets";
import { useEffect, useState } from "react";
import { addCircle, globe, logOut, settings } from "ionicons/icons";
import { getChats } from "../../services/chat";
import React from "react";
import Users from "../../components/Users";
import Modal from "./Modal";
import Settings from "./Settings";
import Loading from "../../components/Loading";
import { arrowForward } from "ionicons/icons";

const Inbox: React.FC = () => {
  const {
    logOutUser,
    avatar,
    userId,
    username: usernameStore,
  } = authStore((store: any) => store);
  const { socket } = useSocket();

  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const { data, isSuccess, isLoading, error } = useQuery<any>({
    queryKey: ["chats"],
    queryFn: () => getChats(),
  });

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
        s
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
            {data?.chats?.map((chat: any) => {
              return (
                <IonCard
                  className="ion-no-margin"
                  key={chat._id}
                  routerLink={`/chat/${chat._id}`}
                  onClick={() => {
                    console.log("selected user", chat);
                    // joinRoom(chat._id);
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
                            {/* <IonChip slot="end" color={"primary"}> */}
                            <IonIcon icon={arrowForward}></IonIcon>
                            {/* </IonChip> */}
                          </IonItem>
                        )}
                      </div>
                    );
                  })}
                </IonCard>
              );
            })}
          </>
        )}

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
