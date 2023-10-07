import { useMutation, useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/users";

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
import { authStore } from "../../store/auth";
import { useParams } from "react-router";
import { createChat } from "../../services/chat";
import ConfirmModal from "../ConfirmModal/index";
import Group from "../Group";

interface UsersProps {
  closeModal: any;
}

const Users: React.FC<UsersProps> = (closeModal) => {
  const { userId, isLoggedIn } = authStore((store: any) => store);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const { chatId } = useParams<{ chatId: string }>();
  const [openGroupModal, setOpenGroupModal] = React.useState<boolean>(false);

  const router = useIonRouter();

  const { mutate } = useMutation({
    mutationFn: ({ name, type, avatar, members }: any) =>
      createChat({ name, type, avatar, members }),
  });

  const createPrivateChat = (memberId: string) => {
    let name = data.users[0].username;
    let avatar = data.users[0].avatar;
    let type = "private";
    mutate(
      { name, type, avatar, members: [userId, memberId] },
      {
        onSuccess: (res: any) => {
          router.push(`/chat/${res.chat._id}`);
        },
      }
    );
  };

  const createGroupChat = () => {
    let name = "group";
    let avatar =
      "https://e7.pngegg.com/pngimages/367/168/png-clipart-computer-icons-business-symbol-consulting-firm-organization-complimentary-business-area.png";
    let type = "group";
    let members = data?.users.map((user: any) => user._id);
    console.log("members", members);
    mutate(
      { name, type, avatar, members },
      {
        onSuccess: (res: any) => {
          setOpenGroupModal(false);
          router.push(`/chat/${res.chat._id}`);
        },
      }
    );
  };

  const filteredUsers = (data: any) => {
    return data?.users.filter((user: any) => user._id !== userId);
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
              {data?.users.map((user: any) => (
                <IonCard
                  key={user._id}
                  onClick={() => {
                    console.log("selected user", user);
                    createPrivateChat(user._id);
                    closeModal.closeModal(false);
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
      <ConfirmModal
        isOpen={openGroupModal}
        onClose={setOpenGroupModal}
        onClick={createGroupChat}
        title="New Group"
        closeModal={closeModal}
      >
        <Group />
      </ConfirmModal>
    </>
  );
};

export default Users;
