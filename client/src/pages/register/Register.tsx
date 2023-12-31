import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../validations-schemas/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { registerUser } from "../../services/auth";
import { RegisterConfig } from "../../validations-schemas/interfaces/user";
import { getUsers } from "../../services/users";
import ImagePicker from "../../components/image/ImagePicker";

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterConfig>({
    defaultValues: {
      phone: "",
      username: "",
      password: "",
      avatar: "",
    },
    resolver: yupResolver(registerSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: registerUser,
  });

  const handleImage = (avatar: string) => {
    setValue("avatar", avatar);
    console.log("imag", avatar);
  };

  const onSubmit = (data: RegisterConfig) => {
    console.log(data);
    console.log("dat", data);
    try {
      mutate(data, {
        onSuccess: (data: any) => {
          console.log("success", data);
        },
        onError: (error) => {
          console.log("Could not create user", error);
        },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonPage className="ion-text-center">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Register</IonTitle>
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
                  <ImagePicker onChange={handleImage}></ImagePicker>

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

export default Register;
