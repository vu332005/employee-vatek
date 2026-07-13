import { Select } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  className?: string;
  size?: "small" | "middle" | "large";
}

const LanguageSwitcher = ({ className = "", size = "small" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className={`flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1 ${className}`}>
      <GlobalOutlined className="text-gray-400" />
      <Select
        value={i18n.language.startsWith("vi") ? "vi" : "en"}
        onChange={changeLanguage}
        size={size}
        variant="borderless"
        popupMatchSelectWidth={false}
        options={[
          { value: "vi", label: "VI" },
          { value: "en", label: "EN" },
        ]}
        className="w-12 font-semibold text-gray-600 cursor-pointer"
      />
    </div>
  );
};

export default LanguageSwitcher;
