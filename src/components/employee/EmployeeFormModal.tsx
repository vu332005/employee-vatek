import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, App } from "antd";
import { useTranslation } from "react-i18next";
import type { Employee } from "../../types/employee";
import AvatarUploader from "./AvatarUploader";
import axiosClient from "../../configs/axiosClient";

interface EmployeeFormModalProps {
  open: boolean;
  editingEmployee: Employee | null;
  onSave: (values: Omit<Employee, "id">) => Promise<void> | void;
  onCancel: () => void;
  confirmLoading: boolean;
}

const EmployeeFormModal = ({
  open,
  editingEmployee,
  onSave,
  onCancel,
  confirmLoading,
}: EmployeeFormModalProps) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      if (editingEmployee) {
        form.setFieldsValue(editingEmployee);
      } else {
        form.resetFields();
      }
    }
  }, [open, editingEmployee, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setUploading(true);

      let imageUrl = values.image || "";

      // only excute when upload new file
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const response = await axiosClient.post<{ url: string }>(
          "/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        imageUrl = response.data.url;
      }

      await onSave({ ...values, image: imageUrl });
      form.resetFields();
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Validation or upload failed:", error);
      if (error.message) {
        message.error(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title={editingEmployee ? t("form.title_edit") : t("form.title_add")}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={confirmLoading || uploading}
      okText={editingEmployee ? t("form.ok_edit") : t("form.ok_add")}
      cancelText={t("form.cancel")}
    >
      <Form
        form={form}
        layout="vertical"
        name="employeeForm"
        initialValues={{ age: 16 }}
      >
        <Form.Item
          name="name"
          label={t("form.name_label")}
          rules={[
            { required: true, message: t("form.name_required") },
            { min: 2, message: t("form.name_min") },
          ]}
        >
          <Input placeholder={t("form.name_placeholder")} />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("form.email_label")}
          rules={[
            { required: true, message: t("form.email_required") },
            { type: "email", message: t("form.email_invalid") },
          ]}
        >
          <Input placeholder={t("form.email_placeholder")} />
        </Form.Item>

        <Form.Item
          name="password"
          label={t("form.password_label") || "Mật khẩu"}
          rules={[
            {
              required: !editingEmployee,
              message: t("form.password_required") || "Vui lòng nhập mật khẩu!",
            },
            { min: 6, message: "Mật khẩu phải từ 6 ký tự trở lên!" },
          ]}
        >
          <Input.Password
            placeholder={
              editingEmployee
                ? "Để trống nếu không muốn đổi mật khẩu"
                : "Nhập mật khẩu đăng nhập"
            }
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="age"
            label={t("form.age_label")}
            rules={[
              {
                type: "number",
                min: 18,
                max: 100,
                message: t("form.age_range"),
              },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder={t("form.age_placeholder")}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t("form.phone_label")}
            rules={[
              {
                pattern: /^[0-9+()\s-]{10,15}$/,
                message: t("form.phone_invalid"),
              },
            ]}
          >
            <Input placeholder={t("form.phone_placeholder")} />
          </Form.Item>
        </div>

        <Form.Item name="country" label={t("form.country_label")}>
          <Input placeholder={t("form.country_placeholder")} />
        </Form.Item>

        <Form.Item name="image" label={t("form.image_label")}>
          <AvatarUploader onFileSelected={setSelectedFile} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeFormModal;
