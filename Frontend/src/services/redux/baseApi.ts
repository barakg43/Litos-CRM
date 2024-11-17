// import { createApi } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { AxiosError, AxiosRequestConfig } from "axios";
import { httpClient } from "../axios";
import { createApi } from "../react-query-toolkit/reactQueryToolkit";
import { BaseQueryFn } from "../react-query-toolkit/reactQueryToolkitType";

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

  if (result.error && result.error.status === 401) {
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
        if (refreshResult) {
          //   api.dispatch(setAuth());
          // retry the initial query
          result = await axiosBaseQuery(args, signal);
        } else {
          //   api.dispatch(logout(5));
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
    throw new BaseQueryError(result.error);
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
    // console.log("result axiosBaseQuery", result);
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    console.log("Query error ", err);
    return {
      error: {
        status: err.response?.status,
        message: err.response?.data || err.message,
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
