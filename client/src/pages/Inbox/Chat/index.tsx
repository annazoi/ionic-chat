import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  arrowBack,
  send,
  sync,
  peopleOutline,
  informationOutline,
  imagesOutline,
} from "ionicons/icons";
import { getChat, sendMessage, updatedChat } from "../../../services/chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import Loading from "../../../components/Loading";
import { authStore } from "../../../store/auth";
import { useSocket } from "../../../hooks/sockets";
import MessageBox from "../../../components/MessageBox";
import "./style.css";
import Modal from "../Modal";

import ChatOptions from "../../../components/ChatOptions";

const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [openMembers, setOpenMembers] = useState<boolean>(false);

  const { userId } = authStore((store: any) => store);
  const { socket } = useSocket();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["chat"],
    refetchOnMount: "always",
    queryFn: () => getChat(chatId),
    onSuccess: (res: any) => {
      console.log("chat query", res.chat.messages);
      setMessages(res.chat.messages);
    },
  });
  const { mutate, isLoading: messageIsLoading } = useMutation({
    mutationFn: ({ chatId, newMessage }: any) =>
      sendMessage(chatId, newMessage),
  });

  useEffect(() => {
    socket?.emit("join_room", chatId);
  }, [socket]);

  useEffect(() => {
    socket?.on("receive_message", (message: any) => {
      console.log("receive_message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [socket]);

  useEffect(() => {
    let lastMessage: any = document?.getElementById?.(`${messages.length - 1}`);
    if (!lastMessage) return;
    lastMessage.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [messages]);

  const sendNewMessage = () => {
    if (newMessage === "") return;
    mutate(
      { chatId, newMessage },
      {
        onSuccess: (res: any) => {
          console.log("success mutate", res);
          const messageData = {
            ...res.chat.messages[res.chat.messages.length - 1],
            room: chatId,
          };
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

            {data?.chat.type === "private" ? (
              <>
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
              </>
            ) : (
              <>
                <IonItem>
                  <IonAvatar>
                    <img src={data?.chat.avatar} alt="" />
                  </IonAvatar>
                  <IonTitle>{data?.chat.name}</IonTitle>
                </IonItem>
              </>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonFab slot="fixed" horizontal="end">
        <IonFabButton size="small">
          <IonIcon icon={informationOutline}></IonIcon>
        </IonFabButton>
        <IonFabList side="bottom">
          <IonFabButton>
            <IonIcon icon={imagesOutline}></IonIcon>
          </IonFabButton>
          {data?.chat.type === "group" && (
            <IonFabButton
              onClick={() => {
                setOpenMembers(!openMembers);
              }}
            >
              <IonIcon icon={peopleOutline}></IonIcon>
            </IonFabButton>
          )}
        </IonFabList>
      </IonFab>
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
          <Loading showLoading={messageIsLoading} />
          <IonButton onClick={sendNewMessage} expand="block" fill="clear">
            <IonIcon icon={send}></IonIcon>
          </IonButton>
        </IonItem>
      </IonContent>
      <Modal isOpen={openMembers} onClose={setOpenMembers} title="Members">
        <ChatOptions></ChatOptions>

        {data?.chat.members.map((member: any, index: any) => {
          return (
            <div key={index} id={index}>
              <IonItem>
                <IonAvatar>
                  <img src={member.avatar} alt="" />
                </IonAvatar>
                <IonTitle>{member.username}</IonTitle>
              </IonItem>
            </div>
          );
        })}
      </Modal>
    </IonPage>
  );
};

export default Chat;
