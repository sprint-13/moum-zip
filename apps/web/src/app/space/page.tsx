import { SpaceSearchPage } from "@/_pages/space-search";

type SpaceSearchParams = Record<string, string | string[] | undefined>;

interface SpacePageProps {
  searchParams?: Promise<SpaceSearchParams> | SpaceSearchParams;
}

export default async function SpacePage({ searchParams }: SpacePageProps) {
  return <SpaceSearchPage searchParams={await searchParams} />;
}
