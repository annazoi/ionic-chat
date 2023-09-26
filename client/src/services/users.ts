  import { API_URL } from "../constants";
import Axios from "axios";

import { getAuthState } from "../store/auth";
import { get } from "react-hook-form";

const getConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${getAuthState().token}`,
    },
  };
};

export const getUser = async (id: string) => {
  try {
    const res = await Axios.get(`${API_URL}/users/${id}`, getConfig());
    return res.data;
  } catch (err: any) {
    console.log("err", err);
    return err;
  }
};

export const getUsers = async () => {
  try {
    const res = await Axios.get(`${API_URL}/users`);
    return res.data;
  } catch (err: any) {
    console.log("err", err);
    return err;
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const res = await Axios.put(`${API_URL}/users/${id}`, data, getConfig());
    return res.data;
  } catch (err: any) {
    console.log("err", err);
    return err;
  }
};
