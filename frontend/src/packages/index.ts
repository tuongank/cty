import { HttpClientImpl } from "./api";
import { Notify } from "quasar";

// Default implementation of AppInformationHandler that uses Quasar Notify
const informationHandler = {
  error: (title: string, message?: string) => {
    Notify.create({
      type: "negative",
      message: message ? `${title}: ${message}` : title,
      position: "top-right"
    });
  },
  execute: (info: any) => {
    let notifyType = "info";
    if (info.level === "error") {
      notifyType = "negative";
    } else if (info.level === "success") {
      notifyType = "positive";
    } else if (info.level === "warning") {
      notifyType = "warning";
    }

    Notify.create({
      type: notifyType,
      message: info.message,
      position: "top-right"
    });
  },
};

// Default loading handler
const loadingHandler = {
  addLoading: (id: string) => {
    // Optionally trigger Quasar loading
  },
  removeLoading: (id: string) => {
    // Optionally hide Quasar loading
  },
};

export const api = new HttpClientImpl(
  informationHandler,
  loadingHandler,
  "http://localhost:8080" // Backend base URL
);

export * from "./api";
export * from "./filter";
export * from "./pagination";
export * from "./sorter";
export * from "./helper";
export * from "./information";
