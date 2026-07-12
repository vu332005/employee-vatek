import { useEffect, useState } from "react";
import { Button, message, Layout } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../store/slices/employeeSlice";
import { employeeService } from "../services/employeeService";
import SearchBar from "../components/employee/SearchBar";
import EmployeeTable from "../components/employee/EmployeeTable";
import EmployeeFormModal from "../components/employee/EmployeeFormModal";
import EmployeeHeader from "../components/share/EmployeeHeader";
import type { Employee } from "../types/employee";

const EmployeePage = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employee);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await employeeService.getAll();
        dispatch(setEmployees(data));
      } catch (err: any) {
        message.error(err.message || "Không thể tải danh sách nhân viên");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await employeeService.delete(id);
      dispatch(deleteEmployee(id));
      message.success("Xóa nhân viên thành công!");
    } catch (err: any) {
      message.error(err.message || "Xóa nhân viên thất bại");
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleSave = async (values: Omit<Employee, "id">) => {
    setSaveLoading(true);
    try {
      if (editingEmployee) {
        const updated = await employeeService.update(
          editingEmployee.id,
          values,
        );
        dispatch(updateEmployee(updated));
        message.success("Cập nhật nhân viên thành công!");
      } else {
        const created = await employeeService.create(values);
        dispatch(addEmployee(created));
        message.success("Thêm nhân viên thành công!");
      }
      setModalOpen(false);
      setEditingEmployee(null);
    } catch (err: any) {
      message.error(err.message || "Lưu thông tin nhân viên thất bại");
    } finally {
      setSaveLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout className="min-h-screen bg-gray-100">
      <EmployeeHeader />

      <div className="p-6 w-full">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold text-gray-800 m-0">
              Danh Sách Nhân Viên
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClick}
                className="h-10 text-sm font-semibold"
              >
                Thêm nhân viên
              </Button>
            </div>
          </div>

          <EmployeeTable
            employees={filteredEmployees}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <EmployeeFormModal
        open={modalOpen}
        editingEmployee={editingEmployee}
        onSave={handleSave}
        onCancel={() => {
          setModalOpen(false);
          setEditingEmployee(null);
        }}
        confirmLoading={saveLoading}
      />
    </Layout>
  );
};

export default EmployeePage;
