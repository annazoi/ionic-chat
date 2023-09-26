import {
    IonButton,
    IonButtons,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
  } from "@ionic/react";
  import React, { Children, Component } from "react";
  import "./style.css";
import { arrowBack } from "ionicons/icons";
  
  interface ConfirmModalProps {
    isOpen: any;
    title: string;
    component: any;
    onClose: any;
    onClick?: any;
  }
  
  const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    title,
    onClick,
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
        <Component opened={isOpen} />
      </IonModal>
    );
  };
  
  export default ConfirmModal;
  