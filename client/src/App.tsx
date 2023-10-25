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
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { homeOutline, chatbubblesOutline, cameraOutline } from "ionicons/icons";
import Inbox from "./pages/Inbox/index";
import Menu from "./pages/menu/Menu";
import Users from "./pages/Inbox/CreateChat";
import Group from "./pages/Inbox/CreateChat/Group";
import Chat from "./pages/Inbox/Chat";
import { authStore } from "./store/auth";
import Settings from "./pages/Inbox/Settings";
import Account from "./pages/Inbox/Settings/Account";
setupIonicReact();

const App: React.FC = () => {
  const { isLoggedIn } = authStore((store): any => store);
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route component={Menu} path="/menu" exact />
          <Route component={Register} path="/register" exact />
          <Route component={Login} path="/login" exact />

          {isLoggedIn ? (
            <>
              <IonTabs>
                <IonRouterOutlet>
                  <Route path="/inbox" component={Inbox} />
                  <Route path="/chat/:chatId" component={Chat} />
                  <Route path="/users" component={Users} />
                  <Route path="/settings" component={Settings} />
                  <Route path="/account" component={Account} />
                  <Redirect exact from="/" to="/inbox" />
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="inbox" href="/inbox">
                    <IonIcon icon={chatbubblesOutline}></IonIcon>
                  </IonTabButton>
                  <IonTabButton tab="camera" href="/camera">
                    <IonIcon icon={cameraOutline}></IonIcon>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </>
          ) : (
            <Redirect exact from="/" to="/login" />
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
