import {
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  useIonRouter,
  IonCard,
  IonCardContent,
  IonCol,
  IonRow,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../../services/auth";
import { LoginConfig } from "../../../validations-schemas/interfaces/user";
import { authStore } from "../../../store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../validations-schemas/auth";
import HidePassword from "../../../components/hidePassword/HidePassword";
import Toast from "../../../components/toast/Toast";
import Loading from "../../../components/loading/Loading";

const Login: React.FC = () => {
  const router = useIonRouter();
  const { isLoggedIn, logIn } = authStore((store: any) => store);

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginConfig>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
  });

  const onSubmit = async (data: any) => {
    try {
      mutate(data, {
        onSuccess: (data: any) => {
          console.log("success", data);
          logIn({
            token: data.token,
            userId: data.userId,
            avatar: data.avatar,
          });
          setMessage("Form submitted successfully!");
          setShowToast(true);
          router.push("/inbox");
        },

        onError: (error: any) => {
          console.log("error", error);
        },
      });
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Sign</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow class="ion-justify-content-center">
          <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
            <IonCard>
              <IonCardContent>
                <Loading showLoading={isLoading} />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <IonInput
                    fill="outline"
                    labelPlacement="floating"
                    label="Username"
                    className="ion-margin-top"
                    {...register("username", { required: true })}
                  />
                  {errors.username && (
                    <p style={{ color: "red" }}>{errors.username?.message}</p>
                  )}
                  <HidePassword register={register} />
                  {errors.password && (
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                  )}
                  <IonButton
                    type="submit"
                    className="ion-margin-top"
                    expand="block"
                    disabled={isLoading}
                  >
                    Login
                  </IonButton>
                </form>

                <Toast
                  showToast={showToast}
                  message={message}
                  setShowToast={setShowToast}
                />
              </IonCardContent>
              <IonButton routerLink="/register" fill="clear" expand="block">
                Create New Account
              </IonButton>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Login;
