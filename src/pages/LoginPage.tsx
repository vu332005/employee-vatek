import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import useGoogleOAuth from "../hooks/useGoogleOAuth";
import GoogleIcon from "../components/icon/GoogleIcon";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginWithGoogle, loading: googleLoading } = useGoogleOAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const user = await authService.login(values.email, values.password);
      dispatch(setUser(user));
      message.success(`Đăng nhập thành công! `);
      navigate("/employees");
    } catch (err: any) {
      message.error(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl border-0 p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
          <p className="text-gray-400 text-sm mt-1">
            Hệ thống quản lý nhân viên
          </p>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không đúng định dạng!" },
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
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
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
              disabled={googleLoading}
              className="w-full h-11 text-base font-semibold"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Hoặc đăng nhập bằng
            </span>
          </div>
        </div>

        <Button
          type="default"
          icon={<GoogleIcon />}
          onClick={() => loginWithGoogle()}
          loading={googleLoading}
          disabled={loading}
          className="w-full h-11 flex items-center justify-center border border-gray-300 rounded-lg hover:border-gray-400 bg-white transition duration-200 text-base font-medium shadow-sm hover:shadow-md text-gray-700 hover:text-gray-900"
        >
          Google
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
