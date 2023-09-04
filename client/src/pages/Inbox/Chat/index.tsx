import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
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
import Loading from "../../../components/Loading";
import { authStore } from "../../../store/auth";

const Chat: React.FC<ChatConfig> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [newMessage, setNewMessage] = useState<string>("");

  const { userId } = authStore((store: any) => store);

  const { data, isSuccess, isLoading } = useQuery<any>({
    queryKey: ["chat"],
    queryFn: () => getChat(chatId),
  });

  isSuccess && console.log("chat", data);

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
          // console.log("success", data);
        },
      }
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
            {data?.chat.members.map((member: any) => {
              return (
                <div key={member._id}>
                  {member._id !== userId && (
                    <IonChip>
                      <IonAvatar>
                        <img src={member.avatar} alt="" />
                      </IonAvatar>
                      <IonLabel>{member.username}</IonLabel>
                    </IonChip>
                  )}
                </div>
              );
            })}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Loading showLoading={isLoading} />
        {data?.chat.messages.map((message: any) => {
          return (
            <IonItem key={message._id}>
              <IonLabel>{message.senderId.username}</IonLabel>
              <IonLabel>{message.message}</IonLabel>
              <IonLabel>{message.createdAt}</IonLabel>
            </IonItem>
          );
        })}

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
