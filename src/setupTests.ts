import "@testing-library/jest-dom";
import { vi } from "vitest";

// mock matchMedia - required for antd compoent in jsdom env
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// mock ResizeObserver bc jsdom not support it but antd uses it
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = ResizeObserverMock;

// mock react-i18next globally for all tests
// note: `t` must be defined as a stable reference inside the factory
// so that useEffect([..., t]) in components doesn't cause infinite re-renders.
vi.mock("react-i18next", () => {
  const t = (key: string, options?: any) => {
    if (options && options.name) {
      return `${key}_mocked_${options.name}`;
    }
    if (options && options.total !== undefined) {
      return `${key}_mocked_${options.total}`;
    }
    return key;
  };

  return {
    useTranslation: () => ({
      t,
      i18n: {
        changeLanguage: vi.fn().mockResolvedValue(true),
        language: "vi",
      },
    }),
    initReactI18next: {
      type: "3rdParty",
      init: vi.fn(),
    },
  };
});

vi.mock("./configs/socketClient", () => ({
  default: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));
