import React, { useState, useEffect } from "react";
import { Upload, App } from "antd";
import { CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { RcFile } from "antd/es/upload";

interface AvatarUploaderProps {
  value?: string;
  onChange?: (value: string) => void; // ant design form callback
  onFileSelected: (file: File | null) => void; // pass the selected file to the parent component
  id?: string; // form item id for test suite compatibility
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  value,
  onChange,
  onFileSelected,
  id,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // sync with external value changes - when switching employees or resetting form
  useEffect(() => {
    if (value && !value.startsWith("blob:")) {
      setPreviewUrl(null);
    } else if (!value) {
      setPreviewUrl(null);
    }
  }, [value]);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";

    if (!isJpgOrPng) {
      message.error(t("form.image_invalid_type"));
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error(t("form.image_invalid_size"));
      return Upload.LIST_IGNORE;
    }

    // local offline preview using blob URL
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    onFileSelected(file);
    onChange?.(blobUrl); // set the form value to the blob URL to pass form validation

    return false; // prevent automatic upload by antd upload
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Revoke blob URL if exists to avoid memory leak
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    onFileSelected(null);
    onChange?.("");
  };

  const displayImage = previewUrl || value;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* hidden input to maintain compatibility with test suites */}
      <input
        type="text"
        id={id}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ display: "none" }}
        className="hidden"
        aria-hidden="true"
      />

      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={beforeUpload}
        className="avatar-uploader"
      >
        <div className="relative group cursor-pointer w-32 h-32 rounded-full overflow-hidden border-2  border-gray-300 hover:border-blue-500 flex items-center justify-center bg-gray-50 ">
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CameraOutlined className="text-white text-xl mb-1" />
                <span className="text-white text-xs font-medium">
                  {t("form.image_change")}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
              <CameraOutlined className="text-2xl mb-1" />
              <span className="text-xs font-medium px-2 text-center">
                {t("form.image_upload_btn")}
              </span>
            </div>
          )}
        </div>
      </Upload>

      {displayImage && (
        <button
          type="button"
          onClick={handleRemove}
          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 border border-red-200 hover:border-red-300 hover:bg-red-50 rounded px-2.5 py-1.5 transition-all bg-white shadow-sm font-medium"
        >
          <DeleteOutlined />
          {t("form.image_remove")}
        </button>
      )}
    </div>
  );
};

export default AvatarUploader;
