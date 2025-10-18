import { QueryClient } from '@tanstack/react-query';

/**
 * @constant {QueryClient} queryClient
 * The central client instance for managing server state, caching, and invalidation.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Common configuration options (optional, but recommended)
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      refetchOnWindowFocus: false, // Prevents aggressive background refreshing
    },
  },
});