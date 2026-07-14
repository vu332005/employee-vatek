import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import LanguageSwitcher from "../components/share/LanguageSwitcher";
import { renderWithProviders } from "../utils/test-utils";

let mockLanguage = "vi";
const mockChangeLanguage = vi.fn();
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: mockChangeLanguage,
      get language() {
        return mockLanguage;
      },
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));

describe("LanguageSwitcher", () => {
  it('should render correctly with default language "VI"', () => {
    renderWithProviders(<LanguageSwitcher />);

    expect(screen.getByText("VI")).toBeInTheDocument();
  });

  it("should trigger i18n changeLanguage when a new language is selected", () => {
    vi.clearAllMocks();
    renderWithProviders(<LanguageSwitcher />);

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);

    const enOption = screen.getByTitle("EN");
    fireEvent.click(enOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });

  it('should render correctly with default language "EN" when i18n language is not "vi"', () => {
    mockLanguage = "en";
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    mockLanguage = "vi";
  });
});
