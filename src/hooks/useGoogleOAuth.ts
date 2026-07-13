import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import { message } from "antd";
import { useState } from "react";

export default function useGoogleOAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        const user = await authService.loginWithGoogle({
          name: data.name,
          email: data.email,
          picture: data.picture,
        });

        dispatch(setUser(user));
        navigate("/employees");
      } catch (error: any) {
        console.error("Lỗi khi xử lý login Google:", error);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("lỗi khi đăng nhập với Google:", error);
    },
  });

  return { loginWithGoogle, loading };
}
