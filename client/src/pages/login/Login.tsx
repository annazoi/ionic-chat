import {
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  useIonRouter,
  useIonLoading,
  IonCard,
  IonCardContent,
  IonCol,
  IonRow,
  IonItem,
  IonLabel,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";
import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { loginUser } from "../../services/auth";
import { LoginConfig } from "../../validations-schemas/interfaces/user";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginConfig>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
  });

  const onSubmit = (data: LoginConfig) => {
    try {
      mutate(data, {
        onSuccess: (data: any) => {
          console.log("success", data);
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
    <IonPage className="ion-text-center">
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <IonInput
                    fill="outline"
                    labelPlacement="floating"
                    label="Username"
                    className="ion-margin-top"
                    {...register("username", { required: true })}
                  />
                  {errors.username && (
                    <p style={{ color: "red" }}>Username is required</p>
                  )}

                  <IonInput
                    fill="outline"
                    labelPlacement="floating"
                    label="Password"
                    className="ion-margin-top"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <p style={{ color: "red" }}>Password is required</p>
                  )}

                  <IonButton
                    type="submit"
                    className="ion-margin-top"
                    expand="block"
                  >
                    Register
                  </IonButton>
                </form>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Login;
