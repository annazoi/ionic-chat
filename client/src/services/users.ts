import { API_URL } from "../constants";
import Axios from "axios";

export const getUser = async (id: string) => {
  const res = await Axios.get(`${API_URL}users/${id}`);
  return res.data;
};

export const getUsers = async () => {
  const res = await Axios.get(`${API_URL}users`);
  return res.data;
};
