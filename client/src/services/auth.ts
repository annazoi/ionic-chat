import {
  LoginConfig,
  RegisterConfig,
} from "../validations-schemas/interfaces/user";
import Axios from "axios";
import { API_URL } from "../constants";

export const registerUser = async (payload: RegisterConfig) => {
  try {
    const response = await Axios.post(`${API_URL}auth/register`, {
      phone: payload.phone,
      username: payload.username,
      password: payload.password,
      avatar: payload.avatar,
    });
    return response.data;
  } catch (err: any) {
    console.log("err", err);
    return err;
  }
};

export const loginUser = async (payload: LoginConfig) => {
  try {
    const response = await Axios.post(`${API_URL}auth/login`, {
      username: payload.username,
      password: payload.password,
    });
    return response.data;
  } catch (err: any) {
    console.log("err", err);
    return err;
  }
};
