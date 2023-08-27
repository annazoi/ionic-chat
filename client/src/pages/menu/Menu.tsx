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

const Menu: React.FC = () => {
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
