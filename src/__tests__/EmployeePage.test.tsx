import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import EmployeePage from "../pages/EmployeePage";
import { renderWithProviders } from "../utils/test-utils";
import { employeeService } from "../services/employeeService";
import socket from "../configs/socketClient";
import { message } from "antd";
import type { Employee } from "../types/employee";

vi.mock("../services/employeeService", () => ({
  employeeService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("antd", async () => {
  const original = await vi.importActual("antd");
  const mockMessage = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  };
  return {
    ...original,
    message: mockMessage,
    App: {
      ...original.App,
      useApp: () => ({
        message: mockMessage,
      }),
    },
  };
});

vi.mock("../components/employee/EmployeeFormModal", () => ({
  default: ({ open, editingEmployee, onSave, onCancel }: any) => {
    if (!open) return null;
    return (
      <div data-testid="mock-employee-modal">
        <span>{editingEmployee ? "form.title_edit" : "form.title_add"}</span>
        <button
          data-testid="modal-save-btn"
          onClick={() =>
            onSave({
              name: "Saved Name",
              email: "saved@gmail.com",
              age: 30,
              phone: "0987654321",
              country: "Vietnam",
            })
          }
        >
          Save
        </button>
        <button data-testid="modal-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  },
}));

describe("EmployeePage", () => {
  const mockEmployees: Employee[] = [
    {
      id: "1",
      name: "Nguyen Van A",
      email: "a@gmail.com",
      age: 20,
      phone: "0123456789",
      country: "Vietnam",
      image: "https://example.com/a.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and render employees on mount", async () => {
    vi.mocked(employeeService.getAll).mockResolvedValue(mockEmployees);

    renderWithProviders(<EmployeePage />);

    expect(employeeService.getAll).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    });
  });

  it("should handle Add employee modal: open, save success, save fail, cancel", async () => {
    vi.mocked(employeeService.getAll).mockResolvedValue([]);
    const createdEmployee = {
      id: "2",
      name: "Saved Name",
      email: "saved@gmail.com",
      age: 30,
      phone: "0987654321",
      country: "Vietnam",
      image: "",
    };

    const { store } = renderWithProviders(<EmployeePage />);

    const addBtn = screen.getByText("employee.add_btn").closest("button")!;

    fireEvent.click(addBtn);
    expect(screen.getByText("form.title_add")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("modal-cancel-btn"));
    expect(screen.queryByText("form.title_add")).not.toBeInTheDocument();

    fireEvent.click(addBtn);
    vi.mocked(employeeService.create).mockRejectedValueOnce({});
    fireEvent.click(screen.getByTestId("modal-save-btn"));
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("employee.save_failed");
    });

    vi.mocked(employeeService.create).mockRejectedValueOnce(
      new Error("Server offline"),
    );
    fireEvent.click(screen.getByTestId("modal-save-btn"));
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Server offline");
    });

    vi.mocked(employeeService.create).mockResolvedValueOnce(createdEmployee);
    fireEvent.click(screen.getByTestId("modal-save-btn"));
    await waitFor(() => {
      expect(employeeService.create).toHaveBeenCalledWith({
        name: "Saved Name",
        email: "saved@gmail.com",
        age: 30,
        phone: "0987654321",
        country: "Vietnam",
      });
      expect(store.getState().employee.employees).toContainEqual(
        createdEmployee,
      );
      expect(message.success).toHaveBeenCalledWith(
        "employee.save_success_create",
      );
      expect(socket.emit).toHaveBeenCalledWith("notify_change", {
        type: "create",
        payload: createdEmployee,
      });
    });
  });

  it("should handle Edit employee modal: open, save success, save fail", async () => {
    vi.mocked(employeeService.getAll).mockResolvedValue(mockEmployees);
    const updatedEmployee = {
      id: "1",
      name: "Saved Name",
      email: "saved@gmail.com",
      age: 30,
      phone: "0987654321",
      country: "Vietnam",
      image: "https://example.com/a.jpg",
    };

    const { store } = renderWithProviders(<EmployeePage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    });

    const editBtns = screen.getAllByText("table.edit");

    fireEvent.click(editBtns[0].closest("button")!);
    expect(screen.getByText("form.title_edit")).toBeInTheDocument();

    vi.mocked(employeeService.update).mockRejectedValueOnce(
      new Error("Update failed"),
    );
    fireEvent.click(screen.getByTestId("modal-save-btn"));
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Update failed");
    });

    vi.mocked(employeeService.update).mockResolvedValueOnce(updatedEmployee);
    fireEvent.click(screen.getByTestId("modal-save-btn"));
    await waitFor(() => {
      expect(employeeService.update).toHaveBeenCalledWith("1", {
        name: "Saved Name",
        email: "saved@gmail.com",
        age: 30,
        phone: "0987654321",
        country: "Vietnam",
      });
      expect(
        store.getState().employee.employees.find((e) => e.id === "1")?.name,
      ).toBe("Saved Name");
      expect(message.success).toHaveBeenCalledWith(
        "employee.save_success_update",
      );
      expect(socket.emit).toHaveBeenCalledWith("notify_change", {
        type: "update",
        payload: updatedEmployee,
      });
    });
  });

  it("should handle delete employee flow successfully and cover delete error path", async () => {
    vi.mocked(employeeService.getAll).mockResolvedValue(mockEmployees);
    vi.mocked(employeeService.delete).mockResolvedValue(undefined);

    const { store } = renderWithProviders(<EmployeePage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    });

    const deleteBtns = screen.getAllByText("table.delete");
    vi.mocked(employeeService.delete).mockRejectedValueOnce({});
    fireEvent.click(deleteBtns[0].closest("button")!);
    const confirmBtn = await screen.findByText("table.ok_text");
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("employee.delete_failed");
    });

    vi.mocked(employeeService.delete).mockRejectedValueOnce(
      new Error("Network issues"),
    );
    fireEvent.click(deleteBtns[0].closest("button")!);
    const confirmBtn2 = await screen.findByText("table.ok_text");
    fireEvent.click(confirmBtn2);
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Network issues");
    });

    vi.mocked(employeeService.delete).mockResolvedValueOnce(undefined);
    fireEvent.click(deleteBtns[0].closest("button")!);
    const confirmBtn3 = await screen.findByText("table.ok_text");
    fireEvent.click(confirmBtn3);
    await waitFor(() => {
      expect(employeeService.delete).toHaveBeenCalledWith("1");
      expect(store.getState().employee.employees).toHaveLength(0);
      expect(message.success).toHaveBeenCalledWith("employee.delete_success");
      expect(socket.emit).toHaveBeenCalledWith("notify_change", {
        type: "delete",
        payload: "1",
      });
    });
  }, 15000);

  it("should handle fetch errors on mount", async () => {
    vi.mocked(employeeService.getAll).mockRejectedValueOnce(
      new Error("Fetch failed"),
    );
    renderWithProviders(<EmployeePage />);
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Fetch failed");
    });

    vi.mocked(employeeService.getAll).mockRejectedValueOnce({});
    renderWithProviders(<EmployeePage />);
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("employee.fetch_failed");
    });
  });

  it("should listen to real-time socket events and update store accordingly", async () => {
    vi.mocked(employeeService.getAll).mockResolvedValue(mockEmployees);

    const { store } = renderWithProviders(<EmployeePage />);

    expect(socket.on).toHaveBeenCalledWith(
      "employee_changed",
      expect.any(Function),
    );
    const socketCallback = vi
      .mocked(socket.on)
      .mock.calls.find(
        (call) => call[0] === "employee_changed",
      )?.[1] as Function;

    const newEmployee = {
      ...mockEmployees[0],
      id: "3",
      name: "Socket Created",
    };
    act(() => {
      socketCallback({ type: "create", payload: newEmployee });
    });
    expect(store.getState().employee.employees).toContainEqual(newEmployee);

    const updatedEmployee = { ...newEmployee, name: "Socket Updated" };
    act(() => {
      socketCallback({ type: "update", payload: updatedEmployee });
    });
    expect(
      store.getState().employee.employees.find((e) => e.id === "3")?.name,
    ).toBe("Socket Updated");

    act(() => {
      socketCallback({ type: "delete", payload: "3" });
    });
    expect(
      store.getState().employee.employees.find((e) => e.id === "3"),
    ).toBeUndefined();
  });
});
