import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { getUsers } from "../../../../services/users";
import { createChat } from "../../../../services/chat";
import { authStore } from "../../../../store/auth";
import ConfirmModal from "../../../../components/ConfirmModal";
import ImagePicker from "../../../../components/ImagePicker";
interface GroupProps {
  closeModal: any;
  setOpenGroupModal: any;
  openGroupModal: any;
}

const Group: React.FC<GroupProps> = ({
  closeModal,
  setOpenGroupModal,
  openGroupModal,
}) => {
  const { userId } = authStore((store: any) => store);
  const router = useIonRouter();
  const [selectedUsers, setSelectedUser] = React.useState<any[]>([]);
  const [name, setName] = React.useState<string>("");
  const [avatar, setAvatar] = React.useState<string>("");

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const { mutate } = useMutation({
    mutationFn: ({ name, type, avatar, members }: any) =>
      createChat({ name, type, avatar, members }),
  });

  const handleImage = (avatar: string) => {
    setAvatar(avatar);
  };

  const createGroupChat = () => {
    if (selectedUsers.length > 1 && name !== "") {
      let members = selectedUsers;
      mutate(
        { name, type: "group", avatar, members: [...members, userId] },
        {
          onSuccess: (res: any) => {
            console.log(res);
            setOpenGroupModal(false);
            closeModal();
            router.push(`/chat/${res.chat._id}`);
          },
        }
      );
    } else if (selectedUsers.length <= 1) {
      alert("Please select more users");
    } else if (name === "") {
      alert("Please enter group name");
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
    <ConfirmModal
      isOpen={openGroupModal}
      onClose={() => setOpenGroupModal(false)}
      onClick={createGroupChat}
      title="New Group"
    >
      <IonContent className="ion-padding">
        <ImagePicker onChange={handleImage} value={avatar}></ImagePicker>
        <div style={{ padding: "8px" }}>
          <IonInput
            fill="outline"
            labelPlacement="floating"
            label="Enter Group Name"
            value={name}
            onIonChange={(e: any) => {
              setName(e.detail.value);
            }}
          ></IonInput>
        </div>
        <IonSearchbar></IonSearchbar>

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
  );
};

export default Group;
