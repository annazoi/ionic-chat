import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { homeOutline, chatbubblesOutline, cameraOutline } from "ionicons/icons";
import Inbox from "./pages/inbox/Inbox";
import Menu from "./pages/menu/Menu";
import Chat from "./components/chat/Chat";
import Users from "./components/users/Users";
setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/menu" />
          <Route exact path="/menu">
            <Menu />
          </Route>

          <Route exact path="/inbox">
            <Inbox />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route component={Register} path="/register" exact />
          <Route exact path="/chat/userId"></Route>
          <Route exact path="/users">
            <Users />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="menu" href="/menu">
            <IonIcon icon={homeOutline}></IonIcon>
          </IonTabButton>
          <IonTabButton tab="inbox" href="/inbox">
            <IonIcon icon={chatbubblesOutline}></IonIcon>
          </IonTabButton>

          <IonTabButton tab="camera" href="/camera">
            <IonIcon icon={cameraOutline}></IonIcon>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
