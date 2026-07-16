import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ProtectedRoute from "../routes/ProtectedRoute";
import { renderWithProviders } from "../utils/test-utils";
import { Routes, Route } from "react-router-dom";

describe("ProtectedRoute", () => {
  it("should redirect to /login if user is not authenticated", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div data-testid="protected-content">Secret Content</div>
            </ProtectedRoute>
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
        route: "/protected",
      },
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("login-content")).toBeInTheDocument();
  });

  it("should render children if user is authenticated", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div data-testid="protected-content">Secret Content</div>
            </ProtectedRoute>
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
            user: {
              id: "1",
              email: "a@gmail.com",
              name: "Admin",
              role: "employee",
            },
            isAuthenticated: true,
            loading: false,
            error: null,
          },
        },
        route: "/protected",
      },
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.queryByTestId("login-content")).not.toBeInTheDocument();
  });
});
