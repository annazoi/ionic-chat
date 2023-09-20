import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { getChat, sendMessage } from "../../../services/chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatConfig } from "../../../validations-schemas/interfaces/chat";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import Loading from "../../../components/Loading";
import { authStore } from "../../../store/auth";
import { useSocket } from "../../../hooks/sockets";
import "./style.css";
import MessageBox from "../../../components/MessageBox";

const Chat: React.FC<ChatConfig> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);

  const { userId } = authStore((store: any) => store);
  const { socket } = useSocket();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["chat"],
    queryFn: () => getChat(chatId),
    onSuccess: (res: any) => {
      setMessages(res.chat.messages);
      console.log("query: messages", res.chat.messages);
    },
  });
  const { mutate } = useMutation({
    mutationFn: ({ chatId, newMessage }: any) =>
      sendMessage(chatId, newMessage),
  });

  const sendNewMessage = () => {
    if (newMessage === "") return;
    mutate(
      { chatId, newMessage },
      {
        onSuccess: (res: any) => {
          console.log("success mutate", res);
          const messageData = res.chat.messages[res.chat.messages.length - 1];
          setMessages(res.chat.messages);
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

  // const gotoButton = () => {
  //   let y = document.getElementById("row-" + text)?.offsetTop;
  //   console.log(y);
  //   let content = document.querySelector("ion-content") as any;
  //   content.scrollToPoint(0, y);
  // };

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
      console.log("receive_message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
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
            {/* <IonInput
              value={text}
              placeholder="Enter Row Number"
              onIonChange={(e: any) => setText(e.detail.value)}
            /> */}
            {data?.chat.members.map((member: any, index: any) => {
              return (
                <div key={index} id={index}>
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
      <IonContent
      // scrollEvents={true}
      // onIonScrollStart={(_e) => {
      //   console.log(_e);
      // }}
      // onIonScroll={() => {}}
      // onIonScrollEnd={() => {}}
      >
        <Loading showLoading={isLoading} />
        {messages.map((message: any, index: any) => {
          return (
            <div key={index} id={index}>
              <MessageBox message={message}></MessageBox>
            </div>
          );
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
