import { IonButton, IonIcon, IonInput } from "@ionic/react";
import "./style.css";
import { useState } from "react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";

const HidePassword = ({ register }: any) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="show-hide-password">
      <IonInput
        fill="outline"
        labelPlacement="floating"
        label="Password"
        className="ion-margin-top"
        type={showPassword ? "text" : "password"}
        value={password}
        onIonChange={(e) => setPassword(e.detail.value!)}
        {...register("password", { required: true })}
      />
      <IonButton
        slot="end"
        className="show-hide-password-button"
        onClick={handlePassword}
      >
        <IonIcon
          slot="icon-only"
          icon={showPassword ? eyeOffOutline : eyeOutline}
        />
      </IonButton>
    </div>
  );
};

export default HidePassword;
