import { useMutation, useQuery } from "@tanstack/react-query";
import { getUsers } from "../../../services/users";

import {
  IonCard,
  IonCardContent,
  IonContent,
  IonSearchbar,
  IonAvatar,
  IonItem,
  IonLabel,
  IonImg,
  IonButton,
  useIonRouter,
  IonIcon,
} from "@ionic/react";
import { chatbubblesOutline } from "ionicons/icons";
import React from "react";
import { authStore } from "../../../store/auth";
import { createChat } from "../../../services/chat";
import Group from "./Group";

interface UsersProps {
  closeModal: any;
}

const CreateChat: React.FC<UsersProps> = ({ closeModal }) => {
  const { userId, isLoggedIn, username } = authStore((store: any) => store);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const [openGroupModal, setOpenGroupModal] = React.useState<boolean>(false);

  const router = useIonRouter();

  const { mutate } = useMutation({
    mutationFn: ({ name, type, avatar, members }: any) =>
      createChat({ name, type, avatar, members }),
  });

  const createPrivateChat = (index: number, memberId: string) => {
    // let name = data.users[index].username + "-" + username;
    // let avatar = data.users[index].avatar;
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
              <IonSearchbar></IonSearchbar>
              <IonButton
                style={{ marginLeft: "8px" }}
                onClick={() => {
                  setOpenGroupModal(true);
                }}
              >
                Create a Group
              </IonButton>
              {data?.users.map((user: any, index: number) => (
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
