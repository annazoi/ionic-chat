import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../../../components/ExploreContainer";
import { getChat, sendMessage } from "../../../services/chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatConfig } from "../../../validations-schemas/interfaces/chat";
import { useParams } from "react-router";
import { useState } from "react";

const Chat: React.FC<ChatConfig> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [newMessage, setNewMessage] = useState<string>("");

  const { data, isSuccess, isLoading } = useQuery<any>({
    queryKey: ["chat"],
    queryFn: () => getChat(chatId),
  });

  const { mutate, isSuccess: isMessageSuccess } = useMutation({
    mutationFn: ({ chatId, newMessage }: any) =>
      sendMessage(chatId, newMessage),
  });

  const handleEnterPress = (event: any) => {
    if (event.key === "Enter") {
      sendNewMessage();
    }
  };

  const sendNewMessage = () => {
    mutate(
      { chatId, newMessage },
      {
        onSuccess: (data: any) => {
          console.log("success", data);
        },
      }
    );
  };

  // isSuccess && console.log("chat", data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inbox</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {isSuccess &&
          data?.chat.messages.map((message: any) => (
            <IonItem key={message._id}>
              <IonLabel>{message.message}</IonLabel>
              <IonLabel>{message.createdAt}</IonLabel>
            </IonItem>
          ))}

        <input
          type="text"
          value={newMessage}
          placeholder="Hey..."
          onKeyDown={handleEnterPress}
          onChange={(event) => {
            setNewMessage(event.target.value);
          }}
        />
        <IonButton onClick={sendNewMessage}>&#9658;</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Chat;
