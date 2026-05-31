export interface AppInformation {
  level: "info" | "warning" | "error" | "success";
  message: string;
  contextId?: string;
}

export interface AppInformationHandler {
  error: (title: string, message?: string) => void;
  execute: (info: AppInformation) => void;
}
