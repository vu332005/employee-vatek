import React, { type PropsWithChildren } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { App } from "antd";
import authReducer from "../store/slices/authSlice";
import employeeReducer from "../store/slices/employeeSlice";
import type { RootState } from "../store/store";

// extend render options -> support redux store and routing initial route
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore<RootState>;
  route?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // create a new store instance for each render -> to avoid state leakage between tests
    store = configureStore<RootState>({
      reducer: {
        auth: authReducer,
        employee: employeeReducer,
      },
      preloadedState: preloadedState as any,
    }),
    route = "/",
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <App>{children}</App>
        </MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
