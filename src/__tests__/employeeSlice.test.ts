import { describe, it, expect } from "vitest";
import employeeReducer, {
  setEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../store/slices/employeeSlice";
import type { Employee, EmployeeState } from "../types/employee";

describe("employeeSlice reducer", () => {
  const initialEmployeeState: EmployeeState = {
    employees: [],
  };

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
    {
      id: "2",
      name: "Tran Thi B",
      email: "b@gmail.com",
      age: 25,
      phone: "0987654321",
      country: "Vietnam",
      image: "https://example.com/b.jpg",
    },
  ];

  it("should return initial state when passed an empty action", () => {
    expect(employeeReducer(undefined, { type: "" })).toEqual(
      initialEmployeeState,
    );
  });

  it("should handle setEmployees action", () => {
    const nextState = employeeReducer(
      initialEmployeeState,
      setEmployees(mockEmployees),
    );
    expect(nextState.employees).toEqual(mockEmployees);
  });

  it("should handle addEmployee action", () => {
    const previousState: EmployeeState = {
      employees: [mockEmployees[0]],
    };
    const nextState = employeeReducer(
      previousState,
      addEmployee(mockEmployees[1]),
    );
    expect(nextState.employees).toHaveLength(2);
    expect(nextState.employees[1]).toEqual(mockEmployees[1]);
  });

  it("should handle updateEmployee action when employee exists", () => {
    const previousState: EmployeeState = {
      employees: [...mockEmployees],
    };
    const updatedEmployee: Employee = {
      ...mockEmployees[0],
      name: "Nguyen Van A Updated",
      age: 21,
    };

    const nextState = employeeReducer(
      previousState,
      updateEmployee(updatedEmployee),
    );
    expect(nextState.employees[0].name).toBe("Nguyen Van A Updated");
    expect(nextState.employees[0].age).toBe(21);
    expect(nextState.employees[1]).toEqual(mockEmployees[1]);
  });

  it("should not mutate state in updateEmployee if employee does not exist", () => {
    const previousState: EmployeeState = {
      employees: [mockEmployees[0]],
    };
    const nonExistentEmployee: Employee = {
      id: "99",
      name: "Unknown",
      email: "unknown@gmail.com",
      age: 30,
      phone: "000000000",
      country: "Unknown",
      image: "https://example.com/unknown.jpg",
    };

    const nextState = employeeReducer(
      previousState,
      updateEmployee(nonExistentEmployee),
    );
    expect(nextState.employees).toHaveLength(1);
    expect(nextState.employees[0]).toEqual(mockEmployees[0]);
  });

  it("should handle deleteEmployee action", () => {
    const previousState: EmployeeState = {
      employees: [...mockEmployees],
    };
    const nextState = employeeReducer(previousState, deleteEmployee("1"));
    expect(nextState.employees).toHaveLength(1);
    expect(nextState.employees[0].id).toBe("2");
  });
});
