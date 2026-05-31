import type { ApiFilter } from "./filter.js";
import { generateUUID } from "./helper.js";
import type { AppInformation, AppInformationHandler } from "./information.js";
import type { ApiPagination } from "./pagination.js";
import type { ApiSorter } from "./sorter.js";
export interface LoadingHandler {
  addLoading: (id: string) => void;
  removeLoading: (id: string) => void;
}
type HttpClientMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
interface HttpClientOption {
  pagination?: ApiPagination | null;
  filter?: ApiFilter | null;
  sorter?: ApiSorter | null;
  timeout?: number;
  ignoreLoadingCallback?: boolean;
  meta?: any;
}
export interface HttpClient {
  jsonRequest<T>(
    method: HttpClientMethod,
    url: string,
    payload?: any,
    options?: HttpClientOption,
  ): Promise<T>;
  formRequest<T>(
    method: HttpClientMethod,
    url: string,
    payload: FormData,
    options?: HttpClientOption,
  ): Promise<T>;
  download(
    method: string,
    url: string,
    payload?: any,
    fileName?: string,
    options?: HttpClientOption,
  ): Promise<void>;
  setAcceptLanguage(language: string): void;
  setBearerToken(token: string): void;
  clearBearerToken(): void;
}
export class HttpClientImpl implements HttpClient {
  public timeout: number = 30000;
  public acceptLanguage: string;
  public bearerToken: string | null;
  public unauthorizedCallback?: () => void;
  constructor(
    private informationHandler?: AppInformationHandler,
    private loadingObj?: LoadingHandler,
    private urlPrefix?: string,
    acceptLanguage?: string,
    unauthorizedCallback?: () => void,
  ) {
    this.acceptLanguage = acceptLanguage ?? "en-US";
    this.bearerToken = null;
    if (unauthorizedCallback) {
      this.unauthorizedCallback = unauthorizedCallback;
    }
  }
  setAcceptLanguage(language: string): void {
    this.acceptLanguage = language;
  }
  setBearerToken(token: string): void {
    this.bearerToken = token;
  }
  clearBearerToken(): void {
    this.bearerToken = null;
  }
  /*************************** Public Methods /****************************/ public get<
    T,
  >(url: string, payload?: any, options?: HttpClientOption): Promise<T> {
    return this.jsonRequest<T>("GET", url, payload, options);
  }
  public delete<T>(
    url: string,
    payload?: any,
    options?: HttpClientOption,
  ): Promise<T> {
    return this.jsonRequest<T>("DELETE", url, payload, options);
  }
  public post<T>(
    url: string,
    payload?: any,
    options?: HttpClientOption,
  ): Promise<T> {
    return this.jsonRequest<T>("POST", url, payload, options);
  }
  public patch<T>(
    url: string,
    payload?: any,
    options?: HttpClientOption,
  ): Promise<T> {
    return this.jsonRequest<T>("PATCH", url, payload, options);
  }
  public put<T>(
    url: string,
    payload?: any,
    options?: HttpClientOption,
  ): Promise<T> {
    return this.jsonRequest<T>("PUT", url, payload, options);
  }
  public jsonRequest<T>(
    method: HttpClientMethod,
    url: string,
    payload?: any,
    options?: HttpClientOption,
  ): Promise<T> {
    switch (method) {
      case "GET":
      case "DELETE":
        return this.requestWithQuery<T>(method, url, payload, options);
      case "POST":
      case "PATCH":
      case "PUT":
        return this.requestWithBody<T>(method, url, payload, options);
    }
  }
  public async formRequest<T>(
    method: string,
    url: string,
    payload: FormData,
    options?: {
      timeout?: number;
      ignoreLoadingCallback?: boolean;
      meta?: any;
      contentType?: string;
    },
  ): Promise<T> {
    const timeout = options?.timeout ? options.timeout : this.timeout;
    let response: Response;
    const id = this.getId();
    try {
      if (this.loadingObj && !options?.ignoreLoadingCallback) {
        this.loadingObj.addLoading(id);
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const headers: { [key: string]: string } = {
        "X-Context-ID": id,
        "Accept-Language": this.acceptLanguage,
      };
      if (this.bearerToken) {
        headers["Authorization"] = `Bearer ${this.bearerToken}`;
      }
      response = await fetch(this.modifyUrl(url), {
        method: method,
        body: payload,
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: headers,
        signal: controller.signal,
      } as RequestInit);
      clearTimeout(timeoutId);
      return this.parseResponse<T>(response, undefined, options?.meta ?? null);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          this.informationHandler?.error("Timeout", "The request timed out");
        } else {
          this.informationHandler?.error(error.name, error.message);
        }
      } else {
        this.informationHandler?.error("Unknown Error Detected");
      }
      throw Error("Service Error Detected");
    } finally {
      if (this.loadingObj && !options?.ignoreLoadingCallback) {
        this.loadingObj.removeLoading(id);
      }
    }
  }
  public async download(
    method: string,
    url: string,
    payload?: any,
    fileName?: string,
    options?: {
      filter?: ApiFilter;
      timeout?: number;
      ignoreLoadingCallback?: boolean;
      contentType?: string;
    },
  ): Promise<void> {
    const timeout = options?.timeout ? options.timeout : 300000;
    let queryParam = {};
    if (method === "GET" && payload) {
      queryParam = Object.assign({}, payload);
    }
    if (options?.filter) {
      queryParam = options.filter.mergePayload(queryParam);
    }
    if (Object.keys(queryParam).length > 0) {
      url = url + "?" + new URLSearchParams(queryParam).toString();
    }
    let response: Response;
    const id = this.getId();
    try {
      if (this.loadingObj && !options?.ignoreLoadingCallback) {
        this.loadingObj.addLoading(id);
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const body = method !== "GET" ? JSON.stringify(payload) : null;
      const headers: { [key: string]: string } = {
        "X-Context-ID": id,
        "Content-Type": options?.contentType ?? "mutipart/form-data",
        "Accept-Language": this.acceptLanguage,
      };
      if (this.bearerToken) {
        headers["Authorization"] = `Bearer ${this.bearerToken}`;
      }
      response = await fetch(this.modifyUrl(url), {
        method: method,
        mode: "cors",
        body: body,
        cache: "no-cache",
        credentials: "include",
        headers: headers,
        signal: controller.signal,
      } as RequestInit);
      clearTimeout(timeoutId);
      if (!response.ok) {
        const appInfo = await this.responseToAppInformation(response);
        throw new Error(appInfo.message);
      }
      const disposition = response.headers.get("Content-Disposition");
      let filename = fileName ? fileName : "downloadFile";
      if (disposition && disposition.includes("attachment")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }
      response
        .blob()
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          this.informationHandler?.error(
            "Download Error",
            error instanceof Error ? error.message : String(error),
          );
        });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          this.informationHandler?.error("Timeout", "The request timed out");
        } else {
          this.informationHandler?.error(error.name, error.message);
        }
      } else {
        this.informationHandler?.error("Unknown Error Detected");
      }
      throw Error("Service Error Detected");
    } finally {
      if (this.loadingObj && !options?.ignoreLoadingCallback) {
        this.loadingObj.removeLoading(id);
      }
    }
  }
  /*************************** Private Methods /****************************/ private async requestWithQuery<
    T,
  >(
    method: HttpClientMethod,
    url: string,
    payload?: any,
    options?: {
      pagination?: ApiPagination | null;
      sorter?: ApiSorter | null;
      filter?: ApiFilter | null;
      timeout?: number;
      ignoreLoadingCallback?: boolean;
      meta?: any;
    },
  ): Promise<T> {
    const timeout = options?.timeout ? options.timeout : this.timeout;
    let queryParam = payload ? Object.assign({}, payload) : {};
    if (options?.filter) {
      queryParam = options.filter.mergePayload(queryParam);
    }
    if (options?.pagination) {
      queryParam = options.pagination.mergePayload(queryParam);
    } else if (options?.sorter) {
      queryParam = options.sorter.mergePayload(queryParam);
    }
    if (Object.keys(queryParam).length > 0) {
      const urlQuery = new URLSearchParams();
      const setUrlQuery = (key: string, value: any) => {
        if (typeof value === "boolean") {
          urlQuery.append(key, value ? "true" : "false");
        } else if (value === null) {
          urlQuery.append(key, "");
        } else if (value !== undefined) {
          urlQuery.append(key, String(value));
        }
      };
      for (const [key, value] of Object.entries(queryParam)) {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            setUrlQuery(key, v);
          });
        } else {
          setUrlQuery(key, value);
        }
      }
      url = url + "?" + urlQuery.toString();
    }
    let response: Response;
    const id = this.getId();
    try {
      if (this.loadingObj && !options?.ignoreLoadingCallback) {
        this.loadingObj.addLoading(id);
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const headers: { [key: string]: string } = {
        "X-Context-ID": id,
        "Content-Type": "application/json",
        "Accept-Language": this.acceptLanguage,
      };
      if (this.bearerToken) {
        headers["Authorization"] = `Bearer ${this.bearerToken}`;
      }
      response = await fetch(this.modifyUrl(url), {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: headers,
        signal: controller.signal,
      } as RequestInit);
      clearTimeout(timeoutId);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          this.informationHandler?.error("Timeout", "The request timed out");
        } else {
          this.informationHandler?.error(error.name, error.message);
        }
      } else {
        this.informationHandler?.error("Unknown Error Detected");
      }
      throw Error("Service Error Detected");
    } finally {
      if (this.loadingObj && !options?.ignoreLoadingCallback) {
        this.loadingObj.removeLoading(id);
      }
    }
    return this.parseResponse(
      response,
      options?.pagination ?? undefined,
      options?.meta ?? null,
    );
  }
  private async requestWithBody<T>(
    method: string,
    url: string,
    payload?: any,
    options?: { timeout?: number; ignoreLoadingCallback?: boolean; meta?: any },
  ): Promise<T> {
    const timeout = options?.timeout ? options.timeout : this.timeout;
    let response: Response;
    const id = this.getId();
    try {
      if (this.loadingObj && !options?.ignoreLoadingCallback) {
        this.loadingObj.addLoading(id);
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const headers: { [key: string]: string } = {
        "X-Context-ID": id,
        "Content-Type": "application/json",
        "Accept-Language": this.acceptLanguage,
      };
      if (this.bearerToken) {
        headers["Authorization"] = `Bearer ${this.bearerToken}`;
      }
      response = await fetch(this.modifyUrl(url), {
        method: method,
        body: JSON.stringify(payload),
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: headers,
        signal: controller.signal,
      } as RequestInit);
      clearTimeout(timeoutId);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          this.informationHandler?.error("Timeout", "The request timed out");
        } else {
          this.informationHandler?.error(error.name, error.message);
        }
      } else {
        this.informationHandler?.error("Unknown Error Detected");
      }
      throw error;
    } finally {
      if (this.loadingObj && !options?.ignoreLoadingCallback) {
        this.loadingObj.removeLoading(id);
      }
    }
    return this.parseResponse<T>(response, options?.meta ?? null);
  }
  private getId(): string {
    return generateUUID();
  }
  private modifyUrl(url: string): string {
    if (this.urlPrefix) {
      if (!url.startsWith("http")) {
        const prefix = this.urlPrefix.endsWith("/")
          ? this.urlPrefix.slice(0, -1)
          : this.urlPrefix;
        const path = url.startsWith("/") ? url : `/${url}`;
        return `${prefix}${path}`;
      }
    }
    return url;
  }
  private async responseToAppInformation(
    response: Response,
  ): Promise<AppInformation> {
    const err: AppInformation = {
      level: "error",
      message: "unknown message detected",
    };
    const contentType = response.headers.get("content-type");
    if (
      contentType &&
      (contentType.includes("application/json") ||
        contentType.includes("application/hal+json"))
    ) {
      const data = await response.json();
      if (data.message) {
        err.message = data.message;
      } else if (data.errors) {
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          err.message = data.errors[0];
        } else if (typeof data.errors === "string") {
          err.message = data.errors;
        }
      }
      if (data.contextId) {
        err.contextId = data.contextId;
      }
    } else if (response.statusText) {
      err.message = response.statusText;
    }
    return err;
  }
  private async parseResponse<T>(
    response: Response,
    pagination?: ApiPagination,
    meta: any = null,
  ): Promise<T> {
    if (!response.ok) {
      if (response.status === 401 && this.unauthorizedCallback) {
        this.unauthorizedCallback();
      }
      if (this.informationHandler) {
        const err = await this.responseToAppInformation(response);
        this.informationHandler?.execute(err);
        throw new Error(err.message);
      }
      throw new Error("fail to parse response");
    }
    try {
      if (response.status === 204) {
        return null as T;
      }
      const contentType = response.headers.get("content-type");
      if (response.status === 204) {
        return null as T;
      } else if (
        contentType &&
        (contentType.includes("application/json") ||
          contentType.includes("application/hal+json"))
      ) {
        const data = await response.json();
        if (pagination) {
          pagination.includeResult(data.meta);
        }
        if (meta !== null && data.meta) {
          for (const [key, value] of Object.entries(data.meta)) {
            meta[key] = value;
          }
        }
        return ("data" in data ? data.data : data) as T;
      } else {
        return response.text() as T;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.informationHandler?.error(error.name, error.message);
      } else {
        this.informationHandler?.error("Unknown Error Detected");
      }
      throw error;
    }
  }
}
