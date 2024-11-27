/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultError, Query, UseMutateFunction } from "@tanstack/react-query";
import { HasRequiredProps, OmitFromUnion, UnwrapPromise } from "./tsHelpers";

export enum DefinitionType {
  query = "query",
  mutation = "mutation",
}
declare const resultType: unique symbol;
declare const baseQuery: unique symbol;
type QueryKey = import("@tanstack/react-query").QueryKey;

export type QueryDefinition<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey = QueryKey
> = BaseEndpointDefinition<QueryArg, BaseQuery, ResultType> &
  QueryExtraOptions<TQueryKey, QueryArg>;
type MutationDefinition<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey = QueryKey
> = BaseEndpointDefinition<QueryArg, BaseQuery, ResultType> &
  MutationExtraOptions<TQueryKey, ResultType, QueryArg>;

type BaseQueryResult<BaseQuery extends BaseQueryFn> = UnwrapPromise<
  ReturnType<BaseQuery>
>;

type BaseEndpointDefinition<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType
> = EndpointDefinitionWithQuery<QueryArg, BaseQuery, ResultType> & {
  [resultType]?: ResultType;
  [baseQuery]?: BaseQuery;
} & HasRequiredProps<
    BaseQueryExtraOptions<BaseQuery>,
    { extraOptions: BaseQueryExtraOptions<BaseQuery> },
    { extraOptions?: BaseQueryExtraOptions<BaseQuery> }
  >;

interface BaseQueryApi {
  signal?: AbortSignal;
}

interface EndpointDefinitionWithQuery<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType
> {
  query(arg: QueryArg): BaseQueryArg<BaseQuery>;

  transformResponse?(
    baseQueryReturnValue: BaseQueryResult<BaseQuery>,
    arg: QueryArg
  ): ResultType | Promise<ResultType>;
}

type QueryArgFrom<D extends BaseEndpointDefinition<any, any, any>> =
  D extends BaseEndpointDefinition<infer QA, any, any> ? QA : unknown;
type ResultTypeFrom<D extends BaseEndpointDefinition<any, any, any>> =
  D extends BaseEndpointDefinition<any, any, infer RT> ? RT : unknown;

type QueryKeyTypeFrom<D extends EndpointDefinition<any, any, any, any>> =
  D extends EndpointDefinition<any, any, any, infer QK> ? QK : unknown;

export type ResultHandlerFn<QueryArg, ResultType> = (
  originalArgs: QueryArg,
  result: ResultType
) => MaybePromise<unknown>;

type ResultHandlers<QueryArg, ResultType, Error> = {
  onSuccess?: ResultHandlerFn<QueryArg, ResultType>;
  onError?: ResultHandlerFn<QueryArg, Error>;
};
export type UseMutation<QueryArg, ResultType> = (
  handlers?: ResultHandlers<QueryArg, ResultType, Error>
) => readonly [
  UseMutateFunction<unknown, unknown, QueryArg, unknown>,
  boolean
] & {
  /* phantom type */
  [resultType]?: ResultType;
};

export type BaseQueryFn<
  Args = any,
  Result = unknown,
  DefinitionExtraOptions = Record<string, never> | unknown
> = (
  args: Args,
  api: BaseQueryApi,
  extraOptions: DefinitionExtraOptions
) => MaybePromise<Result>;

type MaybePromise<T> = T | Promise<T> | (T extends any ? Promise<T> : never);
export type BaseQueryArg<T extends (arg: any, ...args: any[]) => any> =
  T extends (arg: infer A, ...args: any[]) => any ? A : any;
type BaseQueryExtraOptions<BaseQuery extends BaseQueryFn> =
  Parameters<BaseQuery>[2];

declare const _NEVER: unique symbol;
type NEVER = typeof _NEVER;

interface QueryExtraOptions<TQueryKey extends QueryKey, QueryArg> {
  type: DefinitionType.query;
  /**
   * Used by `query` endpoints. Determines which 'key' is attached to the cached data returned by the query.
   * Expects an array of tag type strings, an array of objects of tag types with ids, or a function that returns such an array.
   *
   * Simple Query Keys:
   * 1. `['Post']`
   * 2. `['something', 'special']`
   *
   *  Array Keys with variables:
   * 1.  `() => ['todo', 5]`
   * 2.  `() => ['todo', 5, { preview: true }]`
   * 3.  `(arg:{ status, page }) =>  ['todos', { status, page }]` - equivalent to `4`
   * 4.  `(arg:{ status, page }) =>  ['todos', { page, status }]` - equivalent to `3`
   * 5.  `(arg:{ status, page }) =>  ['todos', { page, status, other: undefined }]` - equivalent to `3`,`4`
   *
   * @example
   *
   * ```ts
   * // codeblock-meta title="providesTags example"
   *
   * import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
   * interface Post {
   *   id: number
   *   name: string
   * }
   * type PostsResponse = Post[]
   *
   * const api = createApi({
   *   baseQuery: fetchBaseQuery({ baseUrl: '/' }),
   *   endpoints: (build) => ({
   *     getPosts: build.query<PostsResponse, void>({
   *       query: ({page}) => `posts&page=${page}`,
   *       // highlight-start
   *       providesQueryKeys: (args:{page}) =>
   *         ["posts",{ type: 'Posts'},page],
   *       // highlight-end
   *     })
   *   })
   * })
   * ```
   */
  providesQueryKeys: (args: QueryArg) => TQueryKey;
  autoCancellation?: boolean;
  refetchInterval?:
    | number
    | false
    | ((
        query: Query<unknown, Error, unknown, TQueryKey>
      ) => number | false | undefined);
  enabled?: boolean;
}
interface MutationExtraOptions<
  TQueryKey extends QueryKey,
  ResultType,
  QueryArg
> {
  type: DefinitionType.mutation;
  invalidatesKeys?: (args: QueryArg, result: ResultType) => TQueryKey;
  onSuccess?: (
    originalArgs: QueryArg,
    result: ResultType
  ) => MaybePromise<unknown>;
  onError?: (originalArgs: QueryArg, error: Error) => MaybePromise<unknown>;
}
type EndpointBuilder<
  BaseQuery extends BaseQueryFn,
  TQueryKey extends QueryKey
> = {
  /**
   * An endpoint definition that retrieves data, and may provide tags to the cache.
   *
   * @example
   * ```js
   * // codeblock-meta title="Example of all query endpoint options"
   * const api = createApi({
   *  baseQuery,
   *  endpoints: (build) => ({
   *    getPost: build.query({
   *      query: (id) => ({ url: `post/${id}` }),
   *      // Pick out data and prevent nested properties in a hook or selector
   *      transformResponse: (response) => response.data,
   *      // Pick out error and prevent nested properties in a hook or selector
   *      transformErrorResponse: (response) => response.error,
   *      // `result` is the server response
   *      providesTags: (result, error, id) => [{ type: 'Post', id }],
   *      // trigger side effects or optimistic updates
   *      onQueryStarted(id, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry, updateCachedData }) {},
   *      // handle subscriptions etc
   *      onCacheEntryAdded(id, { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry, updateCachedData }) {},
   *    }),
   *  }),
   *});
   *```
   */
  query<ResultType, QueryArg = unknown>(
    definition: OmitFromUnion<
      QueryDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>,
      "type"
    >
  ): QueryDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>;
  /**
   * An endpoint definition that alters data on the server or will possibly invalidate the cache.
   *
   * @example
   * ```js
   * // codeblock-meta title="Example of all mutation endpoint options"
   * const api = createApi({
   *   baseQuery,
   *   endpoints: (build) => ({
   *     updatePost: build.mutation({
   *       query: ({ id, ...patch }) => ({ url: `post/${id}`, method: 'PATCH', body: patch }),
   *       // Pick out data and prevent nested properties in a hook or selector
   *       transformResponse: (response) => response.data,
   *       // Pick out error and prevent nested properties in a hook or selector
   *       transformErrorResponse: (response) => response.error,
   *       // `result` is the server response
   *       invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
   *      // trigger side effects or optimistic updates
   *      onQueryStarted(id, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) {},
   *      // handle subscriptions etc
   *      onCacheEntryAdded(id, { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry }) {},
   *     }),
   *   }),
   * });
   * ```
   */
  mutation<ResultType, QueryArg = unknown>(
    definition: OmitFromUnion<
      MutationDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>,
      "type"
    >
  ): MutationDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>;
};

export type EndpointDefinitions = Record<
  string,
  EndpointDefinition<any, any, any, any>
>;

export type EndpointDefinition<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey = QueryKey
> =
  | QueryDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>
  | MutationDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>;

export type Api<
  BaseQuery extends BaseQueryFn,
  TQueryKey extends QueryKey,
  Definitions extends EndpointDefinitions
> = {
  /**
   * A function to inject the endpoints into the original API, but also give you that same API with correct types for these endpoints back. Useful with code-splitting.
   */
  //   endpointDefinitions: Definitions;
  endpoints: Definitions;

  injectEndpoints<NewDefinitions extends EndpointDefinitions>(_: {
    endpoints: (build: EndpointBuilder<BaseQuery, QueryKey>) => NewDefinitions;

    /**
     * Optionally allows endpoints to be overridden if defined by multiple `injectEndpoints` calls.
     *
     * If set to `true`, will override existing endpoints with the new definition.
     * If set to `'throw'`, will throw an error if an endpoint is redefined with a different definition.
     * If set to `false` (or unset), will not override existing endpoints with the new definition, and log a warning in development.
     */
    overrideExisting?: boolean | "throw";
  }): Api<BaseQueryFn, TQueryKey, EndpointDefinitions> &
    HooksWithUniqueNames<NewDefinitions>;
  /**
   *A function to enhance a generated API with additional information. Useful with code-generation.
   */
};

export type CreateApi = {
  /**
   * Creates a service to use in your application. Contains reactQuery hooks and utilities.
   *
   */
  <
    BaseQuery extends BaseQueryFn,
    Definitions extends EndpointDefinitions,
    TQueryKey extends QueryKey
  >(
    options: CreateApiOptions<BaseQuery>
  ): Api<BaseQuery, TQueryKey, Definitions>;
};

export interface CreateApiOptions<BaseQuery extends BaseQueryFn> {
  baseQuery: BaseQuery;
}

export type TransformedResponse<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType
> = (
  baseQueryReturnValue: BaseQueryResult<BaseQuery>,
  arg: QueryArg
) => ResultType | Promise<ResultType>;

export type BuildMutationHook<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey
> = {
  endpointName: string;
  baseQuery: BaseQuery;
  definition: MutationDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>;
};

export type HooksWithUniqueNames<Definitions extends EndpointDefinitions> =
  QueryHookNames<Definitions> & MutationHookNames<Definitions>;

export type QueryHookName<K> = `use${Capitalize<K & string>}Query`;
export type MutationHookName<K> = `use${Capitalize<K & string>}Mutation`;
type QueryHookNames<Definitions extends EndpointDefinitions> = {
  [K in keyof Definitions as Definitions[K] extends {
    type: DefinitionType.query;
  }
    ? QueryHookName<K>
    : never]: UseQuery<
    QueryArgFrom<Extract<Definitions[K], QueryDefinition<any, any, any, any>>>,
    ResultTypeFrom<Extract<Definitions[K], QueryDefinition<any, any, any, any>>>
  >;
};

type MutationHookNames<Definitions extends EndpointDefinitions> = {
  [K in keyof Definitions as Definitions[K] extends {
    type: DefinitionType.mutation;
  }
    ? MutationHookName<K>
    : never]: UseMutation<
    QueryArgFrom<
      Extract<Definitions[K], MutationDefinition<any, any, any, any>>
    >,
    ResultTypeFrom<
      Extract<Definitions[K], MutationDefinition<any, any, any, any>>
    >
  >;
};

export interface QueryOptions<QueryArg, ResultType, Err = Error>
  extends ResultHandlers<QueryArg, ResultType, Err> {
  autoCancellation?: boolean;
  refetchInterval?: number | false | false | undefined;
  enabled?: boolean;
  retryOnMount?: boolean;
  retry?: boolean | number;
}
export type UseQuery<QueryArg, ResultType, TError = string> = (
  args: QueryArg,
  options: QueryOptions<QueryArg, ResultType, TError>
) => QueryResult<QueryArg, ResultType, TError>;
type QueryResult<QueryArg = unknown, TData = unknown, TError = DefaultError> =
  | QueryErrorResult<QueryArg, TData, TError>
  | QuerySuccessResult<QueryArg, TData, TError>
  | QueryLoadingResult<QueryArg, TData, TError>;

interface QueryLoadingResult<QueryArg, ResultType, TError = DefaultError>
  extends QueryObserverBaseResult<ResultType, QueryArg, TError> {
  data: undefined;
  error: null | undefined;
  isError: false;
  isLoading: true;
  //   status: "pending";
}
interface QuerySuccessResult<QueryArg, ResultType, TError = DefaultError>
  extends QueryObserverBaseResult<ResultType, QueryArg, TError> {
  data: ResultType;
  error: undefined;
  isError: false;
  isLoading: false;
  //   status: "success";
}

interface QueryErrorResult<QueryArg, ResultType, TError = DefaultError>
  extends QueryObserverBaseResult<ResultType, QueryArg, TError> {
  data: undefined;
  error: TError;
  isError: true;
  isLoading: false;
  //   status: "error";
}

interface QueryObserverBaseResult<ResultType, QueryArg, TError = DefaultError> {
  data: ResultType | undefined;
  error: TError | null | undefined;
  isLoading: boolean;
  isError: boolean;
  //   status: QueryStatus;
  prefetchQuery: (args: QueryArg) => void;
}
