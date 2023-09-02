import { IonLoading } from "@ionic/react";
import React from "react";

interface LoadingSpinnerProps {
  showLoading: boolean;
}

const Loading: React.FC<LoadingSpinnerProps> = ({ showLoading }) => {
  return (
    <IonLoading
      isOpen={showLoading}
      message={"Please wait..."}
      spinner="circles"
    ></IonLoading>
  );
};

export default Loading;
