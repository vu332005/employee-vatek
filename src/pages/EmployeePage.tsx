import { useEffect, useState } from "react";
import { Button, Layout, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
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
import HasPermission from "../components/share/HasPermission";
import type { Employee } from "../types/employee";
import socket from "../configs/socketClient";

const EmployeePage = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
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
        message.error(err.message || t("employee.fetch_failed"));
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [dispatch, t]);

  // attach listen evnt when mount
  useEffect(() => {
    const handleSocketChange = (data: { type: string; payload: any }) => {
      if (data.type === "delete") {
        dispatch(deleteEmployee(data.payload));
      } else if (data.type === "create") {
        dispatch(addEmployee(data.payload));
      } else if (data.type === "update") {
        dispatch(updateEmployee(data.payload));
      }
    };

    socket.on("employee_changed", handleSocketChange);

    return () => {
      socket.off("employee_changed", handleSocketChange);
    };
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await employeeService.delete(id);
      dispatch(deleteEmployee(id));
      message.success(t("employee.delete_success"));
      socket.emit("notify_change", { type: "delete", payload: id });
    } catch (err: any) {
      message.error(err.message || t("employee.delete_failed"));
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

  const handleSave = async (
    values: Omit<Employee, "id">,
    file: File | null,
  ) => {
    setSaveLoading(true);
    try {
      if (editingEmployee) {
        const updated = file
          ? await employeeService.update(editingEmployee.id, values, file)
          : await employeeService.update(editingEmployee.id, values);
        dispatch(updateEmployee(updated));
        message.success(t("employee.save_success_update"));
        socket.emit("notify_change", { type: "update", payload: updated });
      } else {
        const created = file
          ? await employeeService.create(values, file)
          : await employeeService.create(values);
        dispatch(addEmployee(created));
        message.success(t("employee.save_success_create"));
        socket.emit("notify_change", { type: "create", payload: created });
      }
      setModalOpen(false);
      setEditingEmployee(null);
    } catch (err: any) {
      message.error(err.message || t("employee.save_failed"));
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
              {t("employee.list_title")}
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <HasPermission allowedRoles={["admin"]}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddClick}
                  className="h-10 text-sm font-semibold"
                >
                  {t("employee.add_btn")}
                </Button>
              </HasPermission>
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
