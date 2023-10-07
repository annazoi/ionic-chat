import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import ImagePicker from "../ImagePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { updatedChat, getChat } from "../../services/chat";
import { chatSchema } from "../../validations-schemas/chat";
import { ChatConfig } from "../../validations-schemas/interfaces/chat";

const ChatOptions: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();

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
          className="ion-margin-top"
          {...register("name", { required: true })}
        />

        <IonButton type="submit">Change</IonButton>
      </form>
    </div>
  );
};

export default ChatOptions;
