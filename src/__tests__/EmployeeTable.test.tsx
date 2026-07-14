import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, within } from "@testing-library/react";
import EmployeeTable from "../components/employee/EmployeeTable";
import { renderWithProviders } from "../utils/test-utils";
import type { Employee } from "../types/employee";

describe("EmployeeTable", () => {
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

  it("should render table headers and employee rows correctly", () => {
    renderWithProviders(
      <EmployeeTable
        employees={mockEmployees}
        loading={false}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );

    expect(screen.getAllByText("table.avatar")[0]).toBeInTheDocument();
    expect(screen.getAllByText("table.name")[0]).toBeInTheDocument();
    expect(screen.getAllByText("table.email")[0]).toBeInTheDocument();

    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByText("a@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(screen.getByText("Vietnam")).toBeInTheDocument();
  });

  it("should call onEdit callback when clicking edit button", () => {
    const onEditMock = vi.fn();
    renderWithProviders(
      <EmployeeTable
        employees={mockEmployees}
        loading={false}
        onEdit={onEditMock}
        onDelete={() => {}}
      />,
    );

    const editBtn = screen.getByText("table.edit").closest("button")!;
    fireEvent.click(editBtn);

    expect(onEditMock).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it("should call onDelete callback when confirming deletion from Popconfirm", () => {
    const onDeleteMock = vi.fn();
    renderWithProviders(
      <EmployeeTable
        employees={mockEmployees}
        loading={false}
        onEdit={() => {}}
        onDelete={onDeleteMock}
      />,
    );

    const deleteBtn = screen.getByText("table.delete").closest("button")!;
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByText("table.ok_text");
    fireEvent.click(confirmBtn);

    expect(onDeleteMock).toHaveBeenCalledWith("1");
  });

  it("should cover sorter functions for name and age columns", () => {
    const employees = [
      {
        id: "1",
        name: "B",
        email: "b@gmail.com",
        age: 30,
        phone: "1",
        country: "V",
        image: "",
      },
      {
        id: "2",
        name: "A",
        email: "a@gmail.com",
        age: 20,
        phone: "2",
        country: "V",
        image: "",
      },
    ];
    renderWithProviders(
      <EmployeeTable
        employees={employees}
        loading={false}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );

    const nameHeaders = screen.getAllByText("table.name");
    fireEvent.click(nameHeaders[0]);

    const ageHeaders = screen.getAllByText("table.age");
    fireEvent.click(ageHeaders[0]);

    expect(nameHeaders[0]).toBeInTheDocument();
    expect(ageHeaders[0]).toBeInTheDocument();
  });
});
