import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/employee/SearchBar";
import { renderWithProviders } from "../utils/test-utils";

describe("SearchBar", () => {
  it("should render input field with proper value and placeholder", () => {
    renderWithProviders(<SearchBar value="Nguyen" onChange={() => {}} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Nguyen");
    expect(input.placeholder).toBe("employee.search_placeholder");
  });

  it("should call onChange callback when user types in search input", () => {
    const onChangeMock = vi.fn();
    renderWithProviders(<SearchBar value="" onChange={onChangeMock} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Tran" } });

    expect(onChangeMock).toHaveBeenCalledWith("Tran");
  });
});
