import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import { useTranslation } from "react-i18next";
// cnay có sẵn của antd -> chứa sẵn bản dịch nội bộ của antd
import viVN from "antd/locale/vi_VN";
import enUS from "antd/locale/en_US";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmployeePage from "./pages/EmployeePage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import useSocket from "./hooks/useSocket";

const App = () => {
  useSocket();

  // sync antd language w i18n lan
  const { i18n } = useTranslation();
  const currentLocale = i18n.language.startsWith("vi") ? viVN : enUS;

  return (
    <ConfigProvider
      locale={currentLocale}
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 6,
          fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        },
        components: {
          Button: {
            controlHeight: 38,
          },
          Input: {
            controlHeight: 38,
          },
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <EmployeePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/employees" replace />} />
          </Routes>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
