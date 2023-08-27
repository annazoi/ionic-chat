import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  token: string;
  userId: string;
  logOut: () => void;
  logIn: (payload: any) => void;
}

const initialStateValues = {
  isLoggedIn: false,
  token: "",
  userId: "",
};

export const authStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialStateValues,
        logOut: () => {
          set({
            ...initialStateValues,
          });
        },
        logIn: (payload: any) =>
          set({
            isLoggedIn: true,
            token: payload.token,
            userId: payload.userId,
          }),
      }),
      {
        name: "auth-storage-client",
      }
    )
  )
);

export const getAuthState = () => {
  return authStore.getState();
};
