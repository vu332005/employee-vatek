import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import useGoogleOAuth from "../hooks/useGoogleOAuth";
import GoogleIcon from "../components/icon/GoogleIcon";
import FacebookIcon from "../components/icon/FacebookIcon";
import LanguageSwitcher from "../components/share/LanguageSwitcher";

const FacebookLoginComponent = ((FacebookLogin as any).default ||
  FacebookLogin) as typeof FacebookLogin;

const LoginPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginWithGoogle, loading: googleLoading } = useGoogleOAuth();
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID || "";

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const user = await authService.login(values.email, values.password);
      dispatch(setUser(user));
      message.success(t("login.success"));
      navigate("/employees");
    } catch (err: any) {
      message.error(err.message || t("login.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSuccess = async (profile: any) => {
    setFbLoading(true);
    try {
      const email = profile.email;
      const user = await authService.loginWithFacebook({
        name: profile.name || "",
        email: email,
        picture: profile.picture?.data?.url,
      });
      dispatch(setUser(user));
      navigate("/employees");
    } catch (error: any) {
      console.error("Lỗi xác thực Facebook:", error);
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 px-4">
      {/* language Switcher */}
      <LanguageSwitcher
        className="absolute top-4 right-4 bg-white shadow-sm hover:bg-gray-50 z-10"
        size="small"
      />

      <Card className="w-full max-w-md shadow-lg rounded-xl border-0 p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("login.title")}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{t("login.subtitle")}</p>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={t("login.email")}
            rules={[
              { required: true, message: t("login.email_required") },
              { type: "email", message: t("login.email_invalid") },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="admin@gmail.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("login.password")}
            rules={[{ required: true, message: t("login.password_required") }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="password123"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={googleLoading || fbLoading}
              className="w-full h-11 text-base font-semibold"
            >
              {t("login.login_btn")}
            </Button>
          </Form.Item>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              {t("login.or_login_with")}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="default"
            icon={<GoogleIcon />}
            onClick={() => loginWithGoogle()}
            loading={googleLoading}
            disabled={loading || fbLoading}
            className="flex-1 h-11 flex items-center justify-center border border-gray-300 rounded-lg hover:border-gray-400 bg-white text-base font-medium shadow-sm hover:shadow-md text-gray-700 hover:text-gray-900"
          >
            Google
          </Button>

          <FacebookLoginComponent
            appId={appId}
            onProfileSuccess={handleFacebookSuccess}
            onFail={(error) => {
              console.error("Facebook Login Failed:", error);
            }}
            render={({ onClick }) => (
              <Button
                type="default"
                icon={<FacebookIcon />}
                onClick={onClick}
                loading={fbLoading}
                disabled={loading || googleLoading}
                className="flex-1 h-11 flex items-center justify-center rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white hover:text-white text-base font-medium shadow-sm hover:shadow-md border-none"
              >
                Facebook
              </Button>
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
