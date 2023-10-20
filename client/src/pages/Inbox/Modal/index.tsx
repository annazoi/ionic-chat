import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./style.css";

interface ModalProps {
  isOpen: any;
  title: string;
  onClose: any;
  children?: any;
  closeModal?: any;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeModal,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={closeModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                onClose(false);
              }}
            >
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>{children}</IonContent>
    </IonModal>
  );
};

export default Modal;
