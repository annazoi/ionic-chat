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
  IonAvatar,
  IonImg,
} from "@ionic/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../../services/auth";
import { LoginConfig } from "../../../validations-schemas/interfaces/user";
import { authStore } from "../../../store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../validations-schemas/auth";
import HidePassword from "../../../components/HidePassword";
import Toast from "../../../components/Toast";
import Loading from "../../../components/Loading";
import Logo from "../../../assets/logo.png";
import "./style.css";

const Login: React.FC = () => {
  const router = useIonRouter();

  const { logIn } = authStore((store: any) => store);

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
            username: data.username,
          });
          setMessage("Form submitted successfully!");
          setShowToast(true);
          router.push("/inbox", "forward", "replace");
          window.location.reload();
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
          <IonTitle>Sign</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow class="ion-justify-content-center">
          <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
            <IonImg src={Logo} alt="logo" class="ion-padding"></IonImg>
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
