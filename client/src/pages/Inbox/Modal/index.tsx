import {
  IonButton,
  IonButtons,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { Children, Component } from "react";

interface ModalProps {
  isOpen: any;
  title: string;
  component: any;
  onClose: any;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  component: Component,
}) => {
  return (
    <IonModal isOpen={isOpen}>
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
      <Component opened={isOpen} />
    </IonModal>
  );
};

export default Modal;
