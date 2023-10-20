import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import ImagePicker from "../ImagePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { updatedChat, getChat } from "../../services/chat";
import { chatSchema } from "../../validations-schemas/chat";
import { ChatConfig } from "../../validations-schemas/interfaces/chat";
import Loading from "../Loading";
import SearchUsers from "../SearchUsers";
import { addCircle } from "ionicons/icons";

const ChatOptions: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();

  const [filteredUser, setFilteredUser] = useState([]);
  const [member, setMember] = useState<any[]>([]);

  const { register, handleSubmit, setValue, getValues, reset } =
    useForm<ChatConfig>({
      resolver: yupResolver(chatSchema),
    });

  const { mutate: updatedMutate, isLoading: updatedIsLoading } = useMutation({
    mutationKey: ["chatInfo"],
    mutationFn: (newData: any) => updatedChat(chatId, newData),
  });

  const { mutate: mutateChat, isLoading: isChatLoading } = useMutation({
    mutationKey: ["chat"],
    mutationFn: (chatId: string) => getChat(chatId),
  });

  const { data, isLoading } = useQuery<any>({
    queryKey: ["chat"],
    refetchOnMount: "always",
    queryFn: () => getChat(chatId),
    onSuccess: (res: any) => {
      console.log("chat query", res.chat.messages);
    },
  });

  const handleImage = (avatar: string) => {
    setValue("avatar", avatar);
  };

  useEffect(() => {
    try {
      mutateChat(chatId, {
        onSuccess: (data: any) => {
          console.log("chat", data.chat);
          reset({ avatar: data?.chat.avatar, name: data?.chat.name });
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  const onSubmit = (data: ChatConfig) => {
    try {
      updatedMutate(data, {
        onSuccess: (res: any) => {
          console.log("success mutate", res);
        },

        onError: (error: any) => {
          console.log("error", error);
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div
      style={{
        textAlign: "center",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Loading showLoading={updatedIsLoading} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ImagePicker
          onChange={handleImage}
          register={register}
          value={getValues("avatar")}
        ></ImagePicker>

        <IonInput
          fill="outline"
          labelPlacement="floating"
          label="Change name"
          // className="ion-margin"
          {...register("name", { required: true })}
        />
        <IonButton type="submit">Change</IonButton>
        {data?.chat.members.map((member: any, index: any) => {
          return (
            <div key={index} id={index}>
              <IonItem
              // routerLink={`/chat/${chat._id}`}
              >
                <IonAvatar>
                  <img src={member.avatar} alt="" />
                </IonAvatar>
                <IonTitle>{member.username}</IonTitle>
              </IonItem>
            </div>
          );
        })}
        <SearchUsers
          setFilteredUser={setFilteredUser}
          placeholder="Add members"
        />
        {filteredUser.map((user: any, index: number) => (
          <IonCard
            key={user._id}
            onClick={() => {
              setMember([...member, user]);
              register("members", { required: true });
              console.log("new member", member);
            }}
          >
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonAvatar slot="start">
                  <IonImg src={user.avatar} />
                </IonAvatar>
                <IonLabel>{user.username}</IonLabel>
                <IonIcon icon={addCircle}></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}
      </form>
    </div>
  );
};

export default ChatOptions;
