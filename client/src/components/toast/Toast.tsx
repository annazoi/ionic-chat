import { IonToast } from "@ionic/react";
import React from "react";

interface ToastMessageProps {
  showToast: boolean;
  message: string;
  setShowToast: (show: boolean) => void;
}

const Toast: React.FC<ToastMessageProps> = ({
  showToast,
  message,
  setShowToast,
}) => {
  return (
    <IonToast
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      message={message}
      duration={2000}
    ></IonToast>
  );
};

export default Toast;
