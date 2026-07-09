import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

export { PAGE_META, buildFullTitle } from "./lib/pageMeta";

export function render(url: string): string {
  const queryClient = new QueryClient();
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <App ssrPath={url} />
    </QueryClientProvider>,
  );
}
