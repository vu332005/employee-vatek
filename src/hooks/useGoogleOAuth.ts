import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import { useState } from "react";

export default function useGoogleOAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const user = await authService.loginWithGoogle(
          tokenResponse.access_token,
        );

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
