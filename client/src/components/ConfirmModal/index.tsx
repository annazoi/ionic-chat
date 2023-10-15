import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./style.css";
import { arrowBack } from "ionicons/icons";

interface ConfirmModalProps {
  isOpen: any;
  title: string;
  onClose: any;
  onClick?: any;
  children?: any;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  onClick,
  children,
}) => {
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                onClose(false);
              }}
            >
              <IonIcon icon={arrowBack} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                onClick();
              }}
            >
              CREATE
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </IonModal>
  );
};

export default ConfirmModal;
