export const memberQueryKeys = {
  all: (slug: string) => ["members", slug] as const,
  list: (slug: string, opts: { page: number }) => [...memberQueryKeys.all(slug), opts] as const,
};
