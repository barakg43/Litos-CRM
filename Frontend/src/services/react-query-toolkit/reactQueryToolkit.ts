import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { capitalize } from "../utils";
import {
  Api,
  BaseQueryArg,
  BaseQueryFn,
  BuildMutationHook,
  CreateApi,
  CreateApiOptions,
  DefinitionType,
  EndpointDefinition,
  EndpointDefinitions,
  HooksWithUniqueNames,
  MutationHookName,
  QueryDefinition,
  QueryHookName,
  QueryOptions,
  TransformedResponse,
  UseMutation,
  UseQuery,
} from "./reactQueryToolkitType";
import { safeAssign } from "./tsHelpers";

export const createApi = /* @__PURE__ */ createApiCallback();

function createApiCallback(): CreateApi {
  return function baseCreateApi<
    BaseQuery extends BaseQueryFn,
    Definitions extends EndpointDefinitions
  >(options: CreateApiOptions<BaseQuery>) {
    const { baseQuery } = options;

    const api = {
      injectEndpoints,
      endpoints: {} as Definitions,
    } as Api<BaseQueryFn, QueryKey, Definitions>;

    function injectEndpoints(
      inject: Parameters<typeof api.injectEndpoints>[0]
    ) {
      const evaluatedEndpoints = inject.endpoints({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query: (x) => ({ ...x, type: DefinitionType.query } as any),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutation: (x) => ({ ...x, type: DefinitionType.mutation } as any),
      });
      const endpointsHook: HooksWithUniqueNames<EndpointDefinitions> = {};
      for (const [endpointName, definition] of Object.entries(
        evaluatedEndpoints
      )) {
        if (inject.overrideExisting !== true && endpointName in api.endpoints) {
          if (inject.overrideExisting === "throw") {
            throw new Error(
              `called \`injectEndpoints\` to override already-existing endpointName ${endpointName} without specifying \`overrideExisting: true\``
            );
          } else if (
            typeof process !== "undefined" &&
            process.env.NODE_ENV === "development"
          ) {
            console.error(
              `called \`injectEndpoints\` to override already-existing endpointName ${endpointName} without specifying \`overrideExisting: true\``
            );
          }

          continue;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (api.endpoints as any)[endpointName] = {};

        if (isQueryDefinition(definition) || isMutationDefinition(definition)) {
          safeAssign(api.endpoints[endpointName], definition);
          const { hookName, hookFn } = buildHook({
            endpointName,
            definition,
            baseQuery,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (endpointsHook as any)[hookName] = hookFn;
        }
      }
      //   console.log("endpointsHook", endpointsHook);
      return { ...api, ...endpointsHook };
    }
    return api;
  };
}

function buildHook<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey
>({
  endpointName,
  definition,
  baseQuery,
}: {
  endpointName: string;
  definition: EndpointDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>;
  baseQuery: BaseQuery;
}): {
  hookName: QueryHookName<string> | MutationHookName<string>;
  hookFn: UseQuery<QueryArg, ResultType> | UseMutation<QueryArg, ResultType>;
} {
  let hookFn = undefined;
  if (isQueryDefinition(definition)) {
    const hookName = `use${capitalize(
      endpointName
    )}Query` as QueryHookName<string>;
    hookFn = buildQueryHook(baseQuery, definition);
    return { hookName, hookFn };
  } else if (isMutationDefinition(definition)) {
    const hookName = `use${capitalize(
      endpointName
    )}Mutation` as MutationHookName<string>;
    hookFn = buildMutationHook<QueryArg, BaseQuery, ResultType, TQueryKey>({
      endpointName,
      baseQuery,
      definition,
    });
    return { hookName, hookFn };
  } else {
    throw new Error("invalid endpoint definition");
  }
}
function defaultTransformResponse(baseQueryReturnValue: unknown) {
  return baseQueryReturnValue;
}
function buildQueryHook<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey
>(
  baseQuery: BaseQuery,
  definition: QueryDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>
): UseQuery<QueryArg, ResultType, string> {
  return function useQueryHook(
    queryArgs: QueryArg,
    externalOptions: QueryOptions
  ) {
    const queryClient = useQueryClient();

    const {
      query,
      transformResponse = defaultTransformResponse,
      autoCancellation,
      providesQueryKeys,
      enabled,
      refetchInterval,
    } = definition;
    const {
      enabled: externalEnabled,
      refetchInterval: externalRefetchInterval,
      autoCancellation: externalAutoCancellation,
      retry,
      retryOnMount,
    } = externalOptions ?? {};
    function prefetchQuery(args: QueryArg) {
      queryClient.prefetchQuery({
        queryKey: providesQueryKeys(args),
        queryFn: ({ signal }) =>
          fetchQueryData(
            externalAutoCancellation ?? autoCancellation,
            args,
            query,
            baseQuery,
            transformResponse,
            signal
          ),
      });
    }

    const { data, error, status }: UseQueryResult<ResultType> = useQuery({
      queryKey: providesQueryKeys(queryArgs),
      queryFn: ({ signal }) =>
        fetchQueryData(
          externalAutoCancellation ?? autoCancellation,
          queryArgs,
          query,
          baseQuery,
          transformResponse,
          signal
        ),
      retry,
      retryOnMount,
      enabled: externalEnabled ?? enabled,
      refetchInterval: externalRefetchInterval ?? refetchInterval,
    });
    switch (status) {
      case "success":
        return {
          data,
          error: undefined,
          isLoading: false,
          isError: false,
          //   status: "success",
          prefetchQuery,
        };
        break;
      case "error":
        return {
          data: undefined,
          isLoading: false,
          isError: true,
          error: error.message,
          //   status,
          prefetchQuery,
        };
      default:
        return {
          data: undefined,
          isLoading: true,
          isError: false,
          error: null,
          prefetchQuery,

          //   status,
        };
    }
  };
}

/**
 * Performs a query using the provided baseQuery and endpoint definition.
 * If autoCancellation is true, the query will be automatically cancelled
 * if the component is unmounted before the query completes or new request invoked before the previous one completes.
 * If transformResponse is provided, the response will be passed through it
 * before being returned.
 * @param autoCancellation
 * @param queryArgs
 * @param query
 * @param baseQuery
 * @param transformResponse
 * @param signal
 * @returns The result of the query, or undefined if the response is empty.
 */
async function fetchQueryData<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType
>(
  autoCancellation: boolean | undefined,
  queryArgs: QueryArg,
  query: (arg: QueryArg) => BaseQueryArg<BaseQuery>,
  baseQuery: BaseQuery,
  transformResponse:
    | TransformedResponse<QueryArg, BaseQuery, ResultType>
    | ((baseQueryReturnValue: unknown) => unknown),

  signal: AbortSignal | undefined
) {
  const args = query(queryArgs);
  const rawData = await baseQuery(
    args,
    { signal: autoCancellation ? signal : undefined },
    {}
  );
  if (rawData && Object.entries(rawData).length > 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return transformResponse(rawData as any, queryArgs);
  else return rawData || {};
}
function buildMutationHook<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey
>({
  endpointName,
  baseQuery,
  definition,
}: BuildMutationHook<QueryArg, BaseQuery, ResultType, TQueryKey>): UseMutation<
  QueryArg,
  ResultType
> {
  return function useMutationHook({ onSuccess, onError } = {}) {
    const {
      query,
      invalidatesKeys,
      transformResponse = defaultTransformResponse,
      onError: onErrorPreDefined,
      onSuccess: onSuccessPreDefined,
    } = definition;
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<
      unknown,
      Error,
      QueryArg,
      ResultType
    >({
      mutationFn: async (queryArgs: QueryArg) => {
        return fetchQueryData(
          false,
          queryArgs,
          query,
          baseQuery,
          transformResponse,
          undefined
        );
      },
      mutationKey: [endpointName],
      onSuccess: (data, originalArgs) => {
        const typedData = data as ResultType;

        onSuccessPreDefined?.(originalArgs, typedData);
        onSuccess?.(originalArgs, typedData);
        if (invalidatesKeys)
          queryClient.invalidateQueries({
            queryKey: invalidatesKeys(originalArgs, typedData),
          });
      },

      onError: (error, args) => {
        onErrorPreDefined?.(args, error);
        onError?.(args, error);
      },
    });

    return useMemo(() => [mutate, isPending] as const, [mutate, isPending]);
  };
}

function isQueryDefinition<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey
>(e: EndpointDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>) {
  return e.type === "query" /* query */;
}
function isMutationDefinition<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  TQueryKey extends QueryKey
>(e: EndpointDefinition<QueryArg, BaseQuery, ResultType, TQueryKey>) {
  return e.type === "mutation" /* mutation */;
}
