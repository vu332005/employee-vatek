import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import socket from "../configs/socketClient";

export default function useSocket() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // mount event listen
  useEffect(() => {
    const onConnect = () => {
      console.log("kết nối thành công socket Socket id:", socket.id);
    };

    const onDisconnect = (reason: string) => {
      console.log("socket ngắt kết nối :", reason);
    };

    const onConnectError = (error: Error) => {
      console.error("lỗi kết nối:", error);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [isAuthenticated]);
}
