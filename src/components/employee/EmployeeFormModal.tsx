import { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import type { Employee } from "../../types/employee";

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
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
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
      await onSave(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm mới nhân viên"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText={editingEmployee ? "Lưu thay đổi" : "Thêm mới"}
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        name="employeeForm"
        initialValues={{ age: 16 }}
      >
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên!" },
            { min: 2, message: "Họ tên phải từ 2 ký tự trở lên!" },
          ]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="age"
            label="Tuổi"
            rules={[
              { required: true, message: "Vui lòng nhập tuổi!" },
              {
                type: "number",
                min: 18,
                max: 100,
                message: "Tuổi phải từ 18 đến 100!",
              },
            ]}
          >
            <InputNumber className="w-full" placeholder="Nhập tuổi" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9+()\s-]{10,15}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </div>

        <Form.Item
          name="country"
          label="Quốc gia"
          rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
        >
          <Input placeholder="Nhập quốc gia" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Ảnh đại diện (URL)"
          rules={[
            { required: true, message: "Vui lòng nhập URL ảnh đại diện!" },
            { type: "url", message: "Vui lòng nhập link ảnh hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập URL ảnh đại diện" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeFormModal;
