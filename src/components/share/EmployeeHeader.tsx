import { Button, message } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import LanguageSwitcher from "./LanguageSwitcher";

const EmployeeHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    message.success(t("header.logout_success"));
    navigate("/login");
  };

  return (
    <header className="w-full flex flex-col sm:flex-row justify-between items-center bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-0 min-h-16 sm:h-16 gap-3 sm:gap-0 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-bold text-lg">
          {t("header.title")}
        </span>
      </div>
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
        {/* Language Switcher */}
        <LanguageSwitcher className="bg-gray-50/50 hover:bg-gray-50" size="small" />

        <div className="flex items-center gap-2 text-gray-700">
          <UserOutlined className="text-gray-500 bg-gray-100 p-2 rounded-full" />
          <span className="font-semibold text-sm">
            {user?.name || t("header.admin")}
          </span>
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          size="middle"
        >
          {t("header.logout")}
        </Button>
      </div>
    </header>
  );
};

export default EmployeeHeader;
