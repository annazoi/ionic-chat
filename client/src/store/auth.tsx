import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const initialStateValues: any = {
  isLoggedIn: false,
  token: "",
  userId: "",
};

export const authStore: any = create()(
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
