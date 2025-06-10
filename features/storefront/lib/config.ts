import { GraphQLClient, RequestDocument, Variables } from "graphql-request";
import { parse, DocumentNode } from "graphql";

const getEmptyResponseForQuery = (query: RequestDocument): Record<string, any[] | null> => {
  const document = typeof query === "string" ? parse(query) : query;
  const emptyResponse: Record<string, any[] | null> = {}; // Added index signature

  document.definitions.forEach((def) => {
    if (def.kind === "OperationDefinition") {
      def.selectionSet.selections.forEach((selection) => {
        if (selection.kind === "Field") {
          const name = selection.name.value;
          const isPlural = name.endsWith("s");
          emptyResponse[name] = isPlural ? [] : null;
        }
      });
    }
  });

  return emptyResponse;
};

// Factory function using composition instead of inheritance
const createRetryingClient = async () => {
  const client = new GraphQLClient(process.env.OPENFRONT_GRAPHQL_ENDPOINT!);

  return {
    async request<T = any, V extends Variables = Variables>(
      document: RequestDocument,
      variables?: V,
      requestHeaders?: HeadersInit
    ): Promise<T> {
      try {
        const response = await client.request(document, variables, requestHeaders);
        return response as T;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`GraphQL error: ${errorMessage}`);
        return getEmptyResponseForQuery(document) as T;
      }
    }
  };
};

export const openfrontClient = (() => {
  let client: Awaited<ReturnType<typeof createRetryingClient>> | null = null;
  
  return {
    async request<T = any, V extends Variables = Variables>(
      document: RequestDocument,
      variables?: V,
      requestHeaders?: HeadersInit
    ): Promise<T> {
      if (!client) {
        client = await createRetryingClient();
      }
      return client.request<T, V>(document, variables, requestHeaders);
    }
  };
})();

