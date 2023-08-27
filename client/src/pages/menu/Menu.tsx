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
} from "@ionic/react";
import Logo from "../../assets/logo.png";
import { authStore } from "../../store/auth";

const Menu: React.FC = () => {
  const { logOut } = authStore((store: any) => store);

  const handleLogout = () => {
    logOut();
  };

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonButton expand="block" className="ion-margin-top">
            contacts
          </IonButton>
          <IonButton
            onClick={handleLogout}
            expand="block"
            className="ion-margin-top"
            routerLink="/login"
          >
            Logout
          </IonButton>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Mesge</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center ">
          <div>
            <img src={Logo} alt="logo" width={"70%"} />
          </div>
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
        </IonContent>
      </IonPage>
    </>
  );
};
export default Menu;
