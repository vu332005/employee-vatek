import { useState } from "react";
import { Form, Input, Button, Card, App } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "../services/authService";
import LanguageSwitcher from "../components/share/LanguageSwitcher";

const RegisterPage = () => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      await authService.register(values.name, values.email, values.password);
      message.success(t("register.success"));
      navigate("/login");
    } catch (err: any) {
      message.error(err.message || t("register.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 px-4">
      {/* Language Switcher */}
      <LanguageSwitcher
        className="absolute top-4 right-4 bg-white shadow-sm hover:bg-gray-50 z-10"
        size="small"
      />

      <Card className="w-full max-w-md shadow-lg rounded-xl border-0 p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("register.title")}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{t("register.subtitle")}</p>
        </div>

        <Form
          name="register_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          {/* Họ và tên */}
          <Form.Item
            name="name"
            label={t("register.name")}
            rules={[
              { required: true, message: t("register.name_required") },
              { min: 2, message: t("register.name_min") },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder={t("register.name_placeholder")}
              size="large"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label={t("register.email")}
            rules={[
              { required: true, message: t("register.email_required") },
              { type: "email", message: t("register.email_invalid") },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="example@gmail.com"
              size="large"
            />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item
            name="password"
            label={t("register.password")}
            rules={[
              { required: true, message: t("register.password_required") },
              { min: 6, message: t("register.password_min") },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          {/* Xác nhận mật khẩu */}
          <Form.Item
            name="confirmPassword"
            label={t("register.confirm_password")}
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: t("register.confirm_password_required"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("register.confirm_password_mismatch")),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-11 text-base font-semibold"
            >
              {t("register.register_btn")}
            </Button>
          </Form.Item>
        </Form>

        {/* Link quay về đăng nhập */}
        <div className="text-center mt-5 text-sm text-gray-500">
          {t("register.have_account")}{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            {t("register.login_link")}
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
