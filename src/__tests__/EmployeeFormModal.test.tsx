import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeFormModal from "../components/employee/EmployeeFormModal";
import { renderWithProviders } from "../utils/test-utils";
import type { Employee } from "../types/employee";

describe("EmployeeFormModal", () => {
  const mockEmployee: Employee = {
    id: "1",
    name: "Nguyen Van A",
    email: "a@gmail.com",
    age: 20,
    phone: "0123456789",
    country: "Vietnam",
    image: "https://example.com/a.jpg",
  };

  const onSaveMock = vi.fn();
  const onCancelMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when open is false", () => {
    renderWithProviders(
      <EmployeeFormModal
        open={false}
        editingEmployee={null}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        confirmLoading={false}
      />,
    );

    expect(screen.queryByText("form.title_add")).not.toBeInTheDocument();
  });

  it("should render Add Form title and blank fields when editingEmployee is null", () => {
    renderWithProviders(
      <EmployeeFormModal
        open={true}
        editingEmployee={null}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        confirmLoading={false}
      />,
    );

    expect(screen.getByText("form.title_add")).toBeInTheDocument();
    expect(screen.getByLabelText("form.name_label")).toBeInTheDocument();
    expect(screen.getByLabelText("form.email_label")).toBeInTheDocument();
  });

  it("should pre-populate form fields when editingEmployee is provided", async () => {
    renderWithProviders(
      <EmployeeFormModal
        open={true}
        editingEmployee={mockEmployee}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        confirmLoading={false}
      />,
    );

    expect(screen.getByText("form.title_edit")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Nguyen Van A")).toBeInTheDocument();
      expect(screen.getByDisplayValue("a@gmail.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("0123456789")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Vietnam")).toBeInTheDocument();
    });
  });

  it("should invoke onCancel when clicking cancel button", () => {
    renderWithProviders(
      <EmployeeFormModal
        open={true}
        editingEmployee={null}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        confirmLoading={false}
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: "form.cancel" });
    fireEvent.click(cancelBtn);

    expect(onCancelMock).toHaveBeenCalled();
  });

  it("should trigger onSave with clean form values when fields are valid and OK is clicked", async () => {
    renderWithProviders(
      <EmployeeFormModal
        open={true}
        editingEmployee={null}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        confirmLoading={false}
      />,
    );

    fireEvent.change(screen.getByLabelText("form.name_label"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("form.email_label"), {
      target: { value: "john@example.com" },
    });

    const ageInput = screen.getByLabelText("form.age_label");
    fireEvent.change(ageInput, { target: { value: "25" } });

    fireEvent.change(screen.getByLabelText("form.phone_label"), {
      target: { value: "0901234567" },
    });
    fireEvent.change(screen.getByLabelText("form.country_label"), {
      target: { value: "USA" },
    });
    fireEvent.change(screen.getByLabelText("form.image_label"), {
      target: { value: "https://example.com/john.jpg" },
    });
    fireEvent.change(screen.getByLabelText("form.password_label"), {
      target: { value: "password123" },
    });

    const okBtn = screen.getByRole("button", { name: "form.ok_add" });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        age: 25,
        phone: "0901234567",
        country: "USA",
        image: "https://example.com/john.jpg",
      });
    });
  });

  it("should not call onSave when form has invalid fields", async () => {
    renderWithProviders(
      <EmployeeFormModal
        open={true}
        editingEmployee={null}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        confirmLoading={false}
      />,
    );

    fireEvent.change(screen.getByLabelText("form.name_label"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("form.email_label"), {
      target: { value: "not-an-email" },
    });

    const okBtn = screen.getByRole("button", { name: "form.ok_add" });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(onSaveMock).not.toHaveBeenCalled();
    });
  });
});
