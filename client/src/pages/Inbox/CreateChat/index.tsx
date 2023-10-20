import { useMutation } from "@tanstack/react-query";

import {
  IonCard,
  IonCardContent,
  IonContent,
  IonAvatar,
  IonItem,
  IonLabel,
  IonImg,
  IonButton,
  useIonRouter,
  IonIcon,
} from "@ionic/react";
import { chatbubblesOutline } from "ionicons/icons";
import React, { useState } from "react";
import { authStore } from "../../../store/auth";
import { createChat } from "../../../services/chat";
import Group from "./Group";
import SearchUsers from "../../../components/SearchUsers";

interface UsersProps {
  closeModal: any;
}

const CreateChat: React.FC<UsersProps> = ({ closeModal }) => {
  const { userId, isLoggedIn, username } = authStore((store: any) => store);

  const [openGroupModal, setOpenGroupModal] = React.useState<boolean>(false);
  const [filteredUser, setFilteredUser] = useState([]);

  const router = useIonRouter();

  const { mutate } = useMutation({
    mutationFn: ({ name, type, avatar, members }: any) =>
      createChat({ name, type, avatar, members }),
  });

  const createPrivateChat = (index: number, memberId: string) => {
    mutate(
      { type: "private", members: [userId, memberId] },
      {
        onSuccess: (res: any) => {
          if (res.exist) {
            router.push(`/chat/${res.chatId}`);
          } else {
            router.push(`/chat/${res.chat._id}`);
          }
          closeModal();
        },
      }
    );
  };

  return (
    <>
      <IonContent>
        {isLoggedIn && (
          <>
            <IonCardContent>
              <SearchUsers
                setFilteredUser={setFilteredUser}
                placeholder="Search for users"
              />
              <IonButton
                style={{ marginLeft: "8px" }}
                onClick={() => {
                  setOpenGroupModal(true);
                }}
              >
                Create a Group
              </IonButton>
              {filteredUser.map((user: any, index: number) => (
                <IonCard
                  key={user._id}
                  onClick={() => {
                    createPrivateChat(index, user._id);
                  }}
                >
                  <IonCardContent className="ion-no-padding">
                    <IonItem lines="none">
                      <IonAvatar slot="start">
                        <IonImg src={user.avatar} />
                      </IonAvatar>
                      <IonLabel>{user.username}</IonLabel>
                      <IonIcon icon={chatbubblesOutline}></IonIcon>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonCardContent>
          </>
        )}
      </IonContent>

      <Group
        closeModal={closeModal}
        setOpenGroupModal={() => {
          setOpenGroupModal(false);
        }}
        openGroupModal={openGroupModal}
      />
    </>
  );
};

export default CreateChat;
