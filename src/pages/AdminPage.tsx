import { Button, Card, Result } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdminPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 px-4">
      <span className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        {t("admin.title")}
      </span>
      <Button
        key="back"
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/employees")}
        className="h-11 px-6 rounded-lg text-base font-medium shadow-md hover:shadow-lg transition-all"
      >
        {t("admin.back_btn")}
      </Button>
    </div>
  );
};

export default AdminPage;
