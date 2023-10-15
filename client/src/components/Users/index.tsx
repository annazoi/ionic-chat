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
  IonCheckbox,
} from "@ionic/react";
import { chatbubblesOutline } from "ionicons/icons";
import React, { useEffect } from "react";
import { authStore } from "../../store/auth";
import { useParams } from "react-router";
import { createChat } from "../../services/chat";
import ConfirmModal from "../ConfirmModal/index";

interface UsersProps {
  closeModal: any;
}

const Users: React.FC<UsersProps> = ({ closeModal }) => {
  const { userId, isLoggedIn, username } = authStore((store: any) => store);

  const [selectedUsers, setSelectedUser] = React.useState<any[]>([]);

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
    let name = data.users[index].username + "-" + username;
    let avatar = data.users[index].avatar;
    mutate(
      { name, type: "private", avatar, members: [userId, memberId] },
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

  const createGroupChat = () => {
    if (selectedUsers.length > 1) {
      let name = "group";
      let avatar =
        "https://e7.pngegg.com/pngimages/367/168/png-clipart-computer-icons-business-symbol-consulting-firm-organization-complimentary-business-area.png";
      let members = selectedUsers;
      // console.log("members", members);
      mutate(
        { name, type: "group", avatar, members: [...members, userId] },
        {
          onSuccess: (res: any) => {
            setOpenGroupModal(false);
            closeModal();
            router.push(`/chat/${res.chat._id}`);
          },
        }
      );
    } else {
      alert("Please select users");
    }
  };

  const selectUser = (e: any, userId: string) => {
    if (e.detail.checked) {
      setSelectedUser([...selectedUsers, userId]);
    } else {
      setSelectedUser(selectedUsers.filter((id) => id !== userId));
    }
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
      <ConfirmModal
        isOpen={openGroupModal}
        onClose={() => setOpenGroupModal(false)}
        onClick={createGroupChat}
        title="New Group"
      >
        <IonContent className="ion-padding">
          {data?.users.map((user: any, index: any) => (
            <div key={index}>
              {user._id !== userId && (
                <IonCard>
                  <IonCardContent className="ion-no-padding">
                    <IonItem lines="none">
                      <IonAvatar slot="start">
                        <IonImg src={user.avatar} />
                      </IonAvatar>
                      <IonCheckbox
                        labelPlacement="start"
                        checked={selectedUsers.includes(user._id)}
                        onIonChange={(e) => selectUser(e, user._id)}
                        value={user._id}
                      >
                        <IonLabel>{user.username}</IonLabel>
                      </IonCheckbox>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              )}
            </div>
          ))}
        </IonContent>
      </ConfirmModal>
    </>
  );
};

export default Users;
