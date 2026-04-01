/**
 * searchParams에서 page와 필터 값을 파싱하는 서버 컴포넌트용 유틸.
 * - page: 숫자가 아니거나 1 미만이면 1로 clamp
 * - filter: validFilters가 주어진 경우 포함 여부 검증, 없으면 undefined 반환
 */
export function parsePaginationParams<T extends string>(
  searchParams: Record<string, string | string[] | undefined>,
  opts?: { filterKey?: string; validFilters?: readonly T[] },
): { page: number; filter: T | undefined } {
  const filterKey = opts?.filterKey ?? "category";

  const rawPage = searchParams.page;
  const page = Math.max(1, Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || 1);

  const rawFilter = searchParams[filterKey];
  const filterValue = Array.isArray(rawFilter) ? rawFilter[0] : rawFilter;

  const filter =
    filterValue && opts?.validFilters
      ? opts.validFilters.includes(filterValue as T)
        ? (filterValue as T)
        : undefined
      : (filterValue as T | undefined);

  return { page, filter };
}
