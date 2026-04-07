type Deps = {
  getUser: () => Promise<{
    id?: number | null;
    name?: string | null;
    image?: string | null;
  }>;
};

export async function getCurrentUser({ getUser }: Deps): Promise<{
  id: number | null;
  name: string | null;
  image: string | null;
}> {
  const user = await getUser();

  return {
    id: user.id ?? null,
    name: user.name ?? null,
    image: user.image ?? null,
  };
}
