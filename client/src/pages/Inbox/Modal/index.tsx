import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
// import React, { Children, Component } from "react";

interface ModalProps {
  isOpen: any;
  title: string;
  // component?: any;
  onClose: any;
  children?: any;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  // component: Component,
  children,
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
      {/* {Component && <Component />} */}

      <IonContent>{children}</IonContent>
    </IonModal>
  );
};

export default Modal;
