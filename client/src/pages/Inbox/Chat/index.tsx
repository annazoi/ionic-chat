import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { arrowBack, send, sync } from "ionicons/icons";
import { getChat, sendMessage } from "../../../services/chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatConfig } from "../../../validations-schemas/interfaces/chat";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import Loading from "../../../components/Loading";
import { authStore } from "../../../store/auth";
import { useSocket } from "../../../hooks/sockets";
import MessageBox from "../../../components/MessageBox";
import "./style.css";

const Chat: React.FC<ChatConfig> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);

  const { userId } = authStore((store: any) => store);
  const { socket } = useSocket();

  const router = useIonRouter();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["chat"],
    refetchOnMount: "always",
    queryFn: () => getChat(chatId),
    onSuccess: (res: any) => {
      console.log("chat query", res.chat.messages);
      setMessages(res.chat.messages);
    },
  });
  const { mutate } = useMutation({
    mutationFn: ({ chatId, newMessage }: any) =>
      sendMessage(chatId, newMessage),
  });

  const messageData = messages[messages.length - 1];

  const sendNewMessage = () => {
    if (newMessage === "") return;
    mutate(
      { chatId, newMessage },
      {
        onSuccess: (res: any) => {
          console.log("success mutate", res);
          const messageData = res.chat.messages[res.chat.messages.length - 1];
          // setMessages(res.chat.messages);
          socket?.emit("send_message", messageData);
          setMessages((prevMessages) => [...prevMessages, messageData]);
          setNewMessage("");
        },
        onError: (error: any) => {
          console.log("error", error);
        },
      }
    );
  };

  useEffect(() => {
    let lastMessage: any = document?.getElementById?.(`${messages.length - 1}`);
    if (!lastMessage) return;
    lastMessage.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [messages]);

  useEffect(() => {
    socket?.emit("join_room", chatId);
  }, [socket]);

  useEffect(() => {
    socket?.on("receive_message", (message: any) => {
      // console.log("receive_message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [socket, messageData]);

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
            <IonBackButton defaultHref="/inbox">
              <IonIcon icon={arrowBack} size="large"></IonIcon>
            </IonBackButton>
            {data?.chat.members.map((member: any, index: any) => {
              return (
                <div key={index} id={index}>
                  {member._id !== userId && (
                    <IonItem>
                      <IonAvatar>
                        <img src={member.avatar} alt="" />
                      </IonAvatar>
                      <IonTitle>{member.username}</IonTitle>
                    </IonItem>
                  )}
                </div>
              );
            })}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Loading showLoading={isLoading} />
        {messages.map((message: any, index: any) => {
          return (
            <div key={index} id={index}>
              <MessageBox message={message}></MessageBox>
            </div>
          );
        })}

        <IonItem>
          <IonInput
            type="text"
            value={newMessage}
            placeholder="Aa"
            onKeyPress={handleEnterPress}
            onIonChange={(event: any) => {
              setNewMessage(event.target.value);
            }}
          />
          <IonButton onClick={sendNewMessage} expand="block" fill="clear">
            <IonIcon icon={send}></IonIcon>
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Chat;
