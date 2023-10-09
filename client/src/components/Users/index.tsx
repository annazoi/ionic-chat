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
import React from "react";
import { authStore } from "../../store/auth";
import { useParams } from "react-router";
import { createChat } from "../../services/chat";
import ConfirmModal from "../ConfirmModal/index";

interface UsersProps {
  closeModal: any;
}

const Users: React.FC<UsersProps> = (closeModal) => {
  const { userId, isLoggedIn } = authStore((store: any) => store);

  const [selectedUser, setSelectedUser] = React.useState<any[]>([]);

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

  const selectedUsers = () => {
    return data?.users
      .filter((user: any) => user.checked)
      .map((user: any) => user._id);
  };

  // const filteredUsers = (data: any) => {
  //   return data?.users.filter((user: any) => user._id !== userId);
  // };

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
    let members = selectedUsers();
    // console.log("members", members);
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
        onClick={() => {
          if (selectedUsers().length > 0) {
            createGroupChat();
          } else {
            alert("Please select users");
          }
        }}
        title="New Group"
        closeModal={closeModal}
      >
        <IonContent className="ion-padding">
          {data?.users.map((user: any, index: any) => (
            <IonCard key={index}>
              <IonCardContent className="ion-no-padding">
                <IonItem lines="none">
                  <IonAvatar slot="start">
                    <IonImg src={user.avatar} />
                  </IonAvatar>
                  <IonCheckbox
                    labelPlacement="start"
                    checked={selectedUser.includes(user._id)}
                    onIonChange={(e) => {
                      user.checked = e.detail.checked;
                      setSelectedUser(selectedUsers());
                      console.log("selected user", selectedUsers());
                    }}
                    value={user._id}
                    // ref={(el) => {
                    //   if (el) {
                    //     el.checked = selected.includes(user._id);
                    //   }
                    //   return el;
                    // }}
                  >
                    <IonLabel>{user.username}</IonLabel>
                  </IonCheckbox>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))}
        </IonContent>
      </ConfirmModal>
    </>
  );
};

export default Users;
