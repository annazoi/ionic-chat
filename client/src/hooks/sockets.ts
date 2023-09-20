import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { API_URL } from "../constants";

export const useSocket = () => {
  const [socket, setSocket] = useState<any>();
  useEffect(() => {
    const s = io(`${API_URL}`);

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return {
    socket,
  };
};
