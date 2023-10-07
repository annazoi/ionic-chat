import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
} from "@ionic/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getUser, updateUser } from "../../../../services/users";
import { authStore } from "../../../../store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { logIn } from "ionicons/icons";
import { get, set, useForm } from "react-hook-form";
import ImagePicker from "../../../../components/ImagePicker";
import Loading from "../../../../components/Loading";
import Toast from "../../../../components/Toast";
import { registerSchema } from "../../../../validations-schemas/auth";
import { RegisterConfig } from "../../../../validations-schemas/interfaces/user";
import { useEffect } from "react";

const Settings: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<RegisterConfig>({
    resolver: yupResolver(registerSchema),
  });

  const { userId, updateUser: updateStoreUser } = authStore(
    (store: any) => store
  );
  const [showToast, setShowToast] = useState<boolean>(false);
  const [message, setMessage] = useState<any>("");

  const {
    mutate: userMutate,
    isLoading: isUserLoading,
    error: userError,
  } = useMutation({
    mutationKey: ["user"],
    mutationFn: (userId: string) => getUser(userId),
  });

  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (newData: any) => updateUser(userId, newData),
  });

  const handleImage = (avatar: string) => {
    setValue("avatar", avatar);
  };

  useEffect(() => {
    try {
      userMutate(userId, {
        onSuccess: (data: any) => {
          console.log("user", data.user);
          reset(data?.user);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onSubmit = (data: RegisterConfig) => {
    try {
      mutate(data, {
        onSuccess: (data: any) => {
          updateStoreUser({
            avatar: data?.user.avatar,
            username: data?.user.username,
          });
          console.log("success", data);
          setMessage("Form submitted successfully!");
          setShowToast(true);
        },
        onError: (error) => {
          console.log("Could not create user", error);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonContent>
      <IonCard>
        <IonCardContent>
          {isLoading && <Loading showLoading={isLoading} />}
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonInput
              fill="outline"
              labelPlacement="floating"
              label="Enter Phone"
              className="ion-margin-top"
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <p style={{ color: "red" }}>{errors.phone?.message}</p>
            )}

            <IonInput
              fill="outline"
              labelPlacement="floating"
              label="Enter Username"
              className="ion-margin-top"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <p style={{ color: "red" }}>{errors.username?.message}</p>
            )}

            <IonInput
              fill="outline"
              labelPlacement="floating"
              label="Enter New Password"
              className="ion-margin-top"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password?.message}</p>
            )}
            <ImagePicker
              onChange={handleImage}
              register={register}
              value={getValues("avatar")}
            ></ImagePicker>

            <IonButton
              id="open-toast"
              type="submit"
              className="ion-margin-top"
              expand="block"
            >
              Confirm Changes
            </IonButton>
          </form>
          <Toast
            showToast={showToast}
            message={message}
            setShowToast={setShowToast}
          />
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default Settings;
