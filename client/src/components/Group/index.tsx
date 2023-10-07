import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonRouterLink,
} from "@ionic/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { getUsers } from "../../services/users";
import { createChat } from "../../services/chat";

const Group: React.FC = () => {
  const [selected, setSelected] = React.useState<any[]>([]);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const { mutate } = useMutation({
    mutationFn: ({ name, type, avatar, members }: any) =>
      createChat({ name, type, avatar, members }),
  });

  const selectedUsers = () => {
    return data?.users
      .filter((user: any) => user.checked)
      .map((user: any) => user._id);
  };

  return (
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
                checked={selected.includes(user._id)}
                onIonChange={(e) => {
                  user.checked = e.detail.checked;
                  setSelected(selectedUsers());
                  console.log("selected users", selectedUsers());
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
  );
};

export default Group;
