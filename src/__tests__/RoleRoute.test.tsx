import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import RoleRoute from "../routes/RoleRoute";
import { renderWithProviders } from "../utils/test-utils";
import { Routes, Route } from "react-router-dom";

describe("RoleRoute", () => {
  it("should redirect to /login if user is not authenticated", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <div data-testid="admin-content">Admin Page</div>
            </RoleRoute>
          }
        />
        <Route
          path="/login"
          element={<div data-testid="login-content">Login Page</div>}
        />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          },
        },
        route: "/admin",
      },
    );

    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("login-content")).toBeInTheDocument();
  });

  it("should render children if user has the allowed role", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <div data-testid="admin-content">Admin Page</div>
            </RoleRoute>
          }
        />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: {
              id: "1",
              email: "admin@gmail.com",
              name: "Admin",
              roles: ["admin"],
            },
            isAuthenticated: true,
            loading: false,
            error: null,
          },
        },
        route: "/admin",
      },
    );

    expect(screen.getByTestId("admin-content")).toBeInTheDocument();
  });

  it("should redirect to /employees if user does not have the allowed role and no history", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <div data-testid="admin-content">Admin Page</div>
            </RoleRoute>
          }
        />
        <Route
          path="/employees"
          element={<div data-testid="employees-content">Employees Page</div>}
        />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: {
              id: "2",
              email: "emp@gmail.com",
              name: "Employee",
              roles: ["employee"],
            },
            isAuthenticated: true,
            loading: false,
            error: null,
          },
        },
        route: "/admin",
      },
    );

    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("employees-content")).toBeInTheDocument();
  });
});
