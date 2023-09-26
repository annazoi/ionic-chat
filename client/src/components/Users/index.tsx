import { useMutation, useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/users";

import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonRow,
  IonSearchbar,
  IonAvatar,
  IonItem,
  IonLabel,
  IonImg,
  IonChip,
  IonButton,
} from "@ionic/react";
import React from "react";
import { useSocket } from "../../hooks/sockets";
import Chat from "../Chat";
import { authStore } from "../../store/auth";
import { useParams } from "react-router";
import { createChat } from "../../services/chat";
import ConfirmModal from "../../pages/Inbox/Modal";
import Group from "../Group";

const Users: React.FC = () => {
  const { userId, isLoggedIn } = authStore((store: any) => store);

  const { data, isSuccess } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const { socket } = useSocket();
  const { chatId } = useParams<{ chatId: string }>();
  const [openGroupModal, setOpenGroupModal] = React.useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: ({name, type, avatar, members}:any) => createChat({ name, type, avatar, members }),
  });

  const createPrivateChat = (memberId:string) => {
    let name=data.users[0].username;
    let avatar = data.users[0].avatar;
    let type = "private"; 
    mutate(
      {name, type, avatar, members: [userId, memberId]},
      {
        onSuccess: (res: any) => {
          console.log("success mutate", res);
        },
      }
    );
  };

  const createGroupChat = () => {
    let name="group";
    let avatar = "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
    let type = "group"; 
    mutate(
      {name, type, avatar, members: [...userId]},
      {
        onSuccess: (res: any) => {
          console.log("success mutate", res);
        },
      }
    );
  }



  isSuccess && console.log("all users", data);

  return (
    <>
    <IonContent>
      {isLoggedIn && (
        <>
          <IonCardContent>
            <IonSearchbar></IonSearchbar>
            <IonButton onClick={()=>{
              setOpenGroupModal(true);
            }}>
            Create a Group
            </IonButton>
            {isSuccess &&
              data?.users.map((user: any) => (
                <IonCard
                  key={user._id}
                  // routerLink={`/chat/${chatId}`}
                  onClick={() => {
                    console.log("selected user", user);
                    console.log(`userId: ${user._id}`);
                    createPrivateChat(user._id);
                  }}
                >
                  <IonCardContent className="ion-no-padding">
                    <IonItem lines="none">
                      <IonAvatar slot="start">
                        <IonImg src={user.avatar} />
                      </IonAvatar>
                      <IonLabel>{user.username}</IonLabel>
                      <IonChip slot="end" color={"primary"}>
                        {user.phone}
                      </IonChip>
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
    title="New Group"
    component={Group}
    ></ConfirmModal>

    </>
  );
};

export default Users;
