import { Mutex } from "async-mutex";
import { AxiosError, AxiosRequestConfig } from "axios";
import { httpClient } from "../axios";
import { createApi } from "../react-query-toolkit/reactQueryToolkit";
import { BaseQueryFn } from "../react-query-toolkit/reactQueryToolkitType";
import { StatusCodes } from "./httpStatusCodes";
import { useAuth } from "./slices/authStore";

// create a new mutex
const mutex = new Mutex();

export type AxiosBaseQuery = BaseQueryFn<AxiosBaseQueryProps>;

export const baseQueryWithAuth: AxiosBaseQuery = async (args, api) => {
  //   let abortController;
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  //   console.log("before:", api);
  const { signal } = api;
  let result = await axiosBaseQuery(args, signal);
  if (result.error && result.error.status === StatusCodes.UNAUTHORIZED) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await axiosBaseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
          },
          undefined
        );
        if (refreshResult.data) {
          //   api.dispatch(setAuth());
          // retry the initial query
          result = await axiosBaseQuery(args, signal);
        } else if (
          refreshResult.error?.status === StatusCodes.FORBIDDEN ||
          refreshResult.error?.status === StatusCodes.BAD_REQUEST
        ) {
          useAuth.getState().logout();
          throw result.error;
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await axiosBaseQuery(args, signal);
    }
  } else if (result.error) {
    throw result.error;
  }

  return result.data;
};

type AxiosParamProps = {
  url: string;
  method?: AxiosRequestConfig["method"];
  body?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};
export type AxiosBaseQueryProps = AxiosParamProps | string;

type ErrorDetails = {
  title: string;
  message: string;
  path: string;
  status: number | undefined;
};
async function axiosBaseQuery(
  params: AxiosBaseQueryProps,
  signal: AbortSignal | undefined
) {
  try {
    const requestParams =
      typeof params === "string"
        ? { url: params, method: "GET" }
        : {
            data: params.body,
            url: params.url,
            method: params.method || "GET",
            params: params.params,
            headers: params.headers,
          };

    const result = await httpClient({ ...requestParams, signal });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError<ErrorDetails>;
    return {
      error: err.response?.data
        ? { ...err.response?.data }
        : {
            status: err.response?.status,
            message: err.message,
          },
    };
  }
}
export class BaseQueryError extends Error {
  readonly status: number | undefined;
  readonly error: string | object;

  // base constructor only accepts string message as an argument
  // we extend it here to accept an object, allowing us to pass other data
  constructor({
    status,
    message,
  }: {
    status: number | undefined;
    message: string | object;
  }) {
    if (typeof message === "string") {
      super(message);
    } else {
      super(JSON.stringify(message));
    }

    this.error = message;
    this.status = status; // this property is defined in parent
  }
}
export const baseApi = createApi({
  baseQuery: baseQueryWithAuth,
});
