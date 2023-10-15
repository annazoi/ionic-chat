import Axios from "axios";
import { API_URL } from "../constants";
import { getAuthState } from "../store/auth";

interface CreateChatConfig {
  name: string;
  type: string;
  avatar: string;
  members: string[];
}

const getConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${getAuthState().token}`,
    },
  };
};

export const createChat = async (payload: CreateChatConfig) => {
  try {
    const response = await Axios.post(
      `${API_URL}/chat`,
      {
        ...payload,
      },
      getConfig()
    );
    return response.data;
  } catch (err: any) {
    return err.response.data;
  }
};
export const getChats = async () => {
  try {
    const response = await Axios.get(`${API_URL}/chat`, getConfig());
    return response.data;
  } catch (err: any) {
    return err;
  }
};
export const getChat = async (id: string) => {
  try {
    const response = await Axios.get(`${API_URL}/chat/${id}`, getConfig());
    return response.data;
  } catch (err: any) {
    console.log("err", err);
    return err;
  }
};

export const sendMessage = async (id: string, message: string) => {
  try {
    const response = await Axios.post(
      `${API_URL}/chat/${id}/message`,
      { message },
      getConfig()
    );
    return response.data;
  } catch (err: any) {
    console.log("err", err);
    return err;
  }
};

export const updatedChat = async (id: string, payload: any) => {
  try {
    const response = await Axios.put(
      `${API_URL}/chat/${id}`,
      { ...payload },
      getConfig()
    );
    return response.data;
  } catch (err: any) {
    console.log("err", err);
    return err;
  }
};
