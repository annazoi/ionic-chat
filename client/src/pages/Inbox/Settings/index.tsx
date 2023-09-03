import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonInput,
  IonRow,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getUser, updateUser } from "../../../services/users";
import { authStore } from "../../../store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { logIn } from "ionicons/icons";
import { set, useForm } from "react-hook-form";
import ImagePicker from "../../../components/ImagePicker";
import Loading from "../../../components/Loading";
import Toast from "../../../components/Toast";
import { registerSchema } from "../../../validations-schemas/auth";
import { RegisterConfig } from "../../../validations-schemas/interfaces/user";

const Settings: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterConfig>({
    // defaultValues: {
    //   phone: "",
    //   username: "",
    //   password: "",
    //   avatar: "",
    // },
    resolver: yupResolver(registerSchema),
  });

  const { userId } = authStore((store: any) => store);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [message, setMessage] = useState<any>("");
  const [user, setUser] = useState<any>();
  const [newData, setNewData] = useState<any>();

  const { data: userData, isSuccess: userSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(userId),
    onSuccess: (data: any) => {
      console.log("onSuccess", data.user);
      // setUser(data.user);
      // setValue("phone", data.user.phone);
      // setValue("username", data.user.username);
      // setValue("avatar", data.user.avatar);
    },
  });

  // userSuccess && setUser(userData);

  userSuccess && console.log("user", userData);

  const { mutate, isSuccess, isLoading, error } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: ({ newData }: any) => updateUser(userId, newData),
  });

  const handleImage = (avatar: string) => {
    setValue("avatar", avatar);
    console.log("imag", avatar);
  };

  const onSubmit = (data: RegisterConfig) => {
    console.log("data", data);
    setNewData(data);
    try {
      mutate(
        { newData, userId },
        {
          onSuccess: (data: any) => {
            console.log("success", data);
            setMessage("Form submitted successfully!");
            setShowToast(true);
          },
          onError: (error) => {
            console.log("Could not create user", error);
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonCard>
      <IonCardContent>
        {isLoading && <Loading showLoading={isLoading} />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonInput
            fill="outline"
            labelPlacement="floating"
            label="Enter Phone"
            className="ion-margin-top"
            // value={user?.phone}
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
            // value={user?.username}
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
          <ImagePicker onChange={handleImage}></ImagePicker>

          <IonButton
            id="open-toast"
            type="submit"
            className="ion-margin-top"
            expand="block"
          >
            Register
          </IonButton>
        </form>
        <Toast
          showToast={showToast}
          message={message}
          setShowToast={setShowToast}
        />
      </IonCardContent>
    </IonCard>
  );
};

export default Settings;
