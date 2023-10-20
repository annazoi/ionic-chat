import { IonCard, IonContent, IonIcon, IonItem } from "@ionic/react";
import React, { useState } from "react";
import { authStore } from "../../../store/auth";
import { arrowForward, eye, logIn, settings } from "ionicons/icons";

import Modal from "../Modal";
import Account from "./Account";

const Settings: React.FC = () => {
  const { avatar } = authStore((store: any) => store);

  const [openAccount, setOpenAccount] = useState<boolean>(false);

  return (
    <IonContent>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <img
          src={avatar}
          style={{
            borderRadius: "50%",
            width: "20%",
            height: "20%",
            border: "black 2px solid",
          }}
        ></img>
      </div>
      <IonCard>
        <IonItem
          onClick={() => {
            setOpenAccount(true);
          }}
        >
          <IonIcon
            icon={eye}
            slot="start"
            className="ion-no-margin"
            style={{ paddingRight: "15px" }}
          ></IonIcon>
          Active Status
          <IonIcon slot="end" icon={arrowForward}></IonIcon>
        </IonItem>
        <IonItem
          onClick={() => {
            setOpenAccount(true);
          }}
        >
          <IonIcon
            icon={settings}
            slot="start"
            className="ion-no-margin"
            style={{ paddingRight: "15px" }}
          ></IonIcon>
          Account Settings
          <IonIcon slot="end" icon={arrowForward}></IonIcon>
        </IonItem>
      </IonCard>
      <Modal
        isOpen={openAccount}
        onClose={setOpenAccount}
        title="Account Settings"
      >
        <Account />
      </Modal>
    </IonContent>
  );
};

export default Settings;
