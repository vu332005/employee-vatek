import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";
// cnay có sẵn của antd -> chứa sẵn bản dịch nội bộ của antd
import viVN from "antd/locale/vi_VN";
import enUS from "antd/locale/en_US";

import LoginPage from "./pages/LoginPage";
import EmployeePage from "./pages/EmployeePage";
import ProtectedRoute from "./routes/ProtectedRoute";
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
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/employees" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
