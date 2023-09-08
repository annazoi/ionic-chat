import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { getChat, sendMessage } from "../../../services/chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatConfig } from "../../../validations-schemas/interfaces/chat";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { authStore } from "../../../store/auth";
import { useSocket } from "../../../hooks/sockets";
import "./style.css";
import MessageBox from "../../../components/MessageBox";

const Chat: React.FC<ChatConfig> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [newMessage, setNewMessage] = useState<string>("");
  const [showTime, setShowTime] = useState<boolean>(false);

  const { userId } = authStore((store: any) => store);
  const { socket } = useSocket();

  const { data, isSuccess, isLoading } = useQuery<any>({
    queryKey: ["chat"],
    queryFn: () => getChat(chatId),
  });

  const { mutate, isSuccess: isMessageSuccess } = useMutation({
    mutationFn: ({ chatId, newMessage }: any) =>
      sendMessage(chatId, newMessage),
  });

  const sendNewMessage = () => {
    mutate(
      { chatId, newMessage },
      {
        onSuccess: (data: any) => {
          console.log("success", data);
        },
        onError: (error: any) => {
          console.log("error", error);
        },
        onSettled: () => {
          if (newMessage !== "") {
            const messageData = {
              room: chatId,
              message: newMessage,

              // userId: userId,
            };
            socket?.emit("send_message", messageData);
            data?.chat.messages.push({
              message: newMessage,
              senderId: userId,
              // _id: userId,
              // createdAt: new Date(),
              // userId: userId,
            });
          }
          setNewMessage("");
        },
      }
    );
  };

  useEffect(() => {
    const data = {
      room: chatId,
    };
    if (socket?.connected) {
      socket?.emit("join_room", data);
    }
    console.log(data, "data from room");
  }, [socket]);

  useEffect(() => {
    if (socket?.connected) {
      socket?.on("receive_message", (data: any) => {
        data?.chat.messages.push({
          message: data?.message,
          senderId: data?.senderId,
          createdAt: data?.createdAt,
        });
        console.log("data from receive message", data);
      });
    }
  }, [socket]);

  const handleEnterPress = (event: any) => {
    if (event.key === "Enter") {
      sendNewMessage();
    }
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
          return <MessageBox key={message._id} message={message}></MessageBox>;
        })}
        <input
          type="text"
          value={newMessage}
          placeholder="Aa"
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
