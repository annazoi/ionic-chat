import "style.css"

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
  
  const ConfirmModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    component: Component,
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
                Close
              </IonButton>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
            
          </IonToolbar>
        </IonHeader>
        <Component opened={isOpen} />
      </IonModal>
    );
  };
  
  export default ConfirmModal;
  