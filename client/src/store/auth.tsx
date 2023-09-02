import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  token: string;
  userId: string;
  avatar: string;
  logOutUser: () => void;
  logIn: (payload: any) => void;
}

const initialStateValues = {
  isLoggedIn: false,
  token: "",
  userId: "",
  avatar: "",
};

export const authStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialStateValues,
        logOutUser: () => {
          set({
            ...initialStateValues,
          });
        },
        logIn: (payload: any) =>
          set({
            isLoggedIn: true,
            token: payload.token,
            userId: payload.userId,
            avatar: payload.avatar,
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
