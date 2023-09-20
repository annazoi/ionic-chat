import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import Logo from "../../assets/logo.png";
import { authStore } from "../../store/auth";

const Menu: React.FC = () => {
  const { logOutUser } = authStore((store: any) => store);

  const handleLogout = () => {
    logOutUser();
  };

  return (
    <>
      <IonPage id="main-content">
        <IonContent className="ion-padding ion-text-center ">
          <IonCardContent>
            <img
              src={Logo}
              alt="logo"
              width={"90%"}
              style={{ padding: "30px", borderRadius: "50%" }}
            />
            <IonButton routerLink="/register" expand="block">
              register
            </IonButton>
            <IonButton
              routerLink="/login"
              expand="block"
              className="ion-margin-top"
            >
              login
            </IonButton>
          </IonCardContent>
        </IonContent>
      </IonPage>
    </>
  );
};
export default Menu;
