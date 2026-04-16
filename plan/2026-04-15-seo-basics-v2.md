# SEO Basics Cleanup Plan

- Plan type: implementation
- Version: v2
- Status: in_progress
- Current phase: verify
- Progress: 4/4 work units completed + 4 follow-up refinements
- Next step: verify final metadata outputs

## Summary

This task adds baseline SEO for the Next.js App Router web app without expanding into a full SEO rewrite. The approved scope is:

1. Shared metadata defaults at the app root
2. `robots.txt` via `src/app/robots.ts`
3. `sitemap.xml` via `src/app/sitemap.ts`
4. Page-level metadata for `/search`
5. Minimal `noindex` coverage for clearly private or auth-only routes

## Work Units

1. Shared site config and root metadata
2. `robots.ts` and `sitemap.ts`
3. `/search` page metadata
4. Private-route `noindex` metadata

## Follow-up Refinements

1. Landing page metadata copy improvement
2. Public detail-page metadata
3. Public detail-page metadata readability cleanup
4. Public detail-page route comment clarification

## Decisions

- Use `NEXT_PUBLIC_SITE_URL` when provided, with `https://moum-zip-web.vercel.app/` as the production fallback
- Use `title.template` in the form `%s | 모움.zip`
- Index only the base `/search` route; filtered query states should canonicalize to `/search` and return `noindex`
- Exclude authenticated, authoring, OAuth, API, and membership-scoped routes from sitemap indexing
- Keep `robots` disallow rules limited to machine endpoints; confirmed `/api/images/presigned` is upload URL issuance, not public asset delivery

## Verification Targets

- Type check passes after each work unit
- Final build emits working `robots.txt` and `sitemap.xml`
- `/search` metadata matches the indexing policy
- Existing page behavior remains unchanged

## Progress Log

- 2026-04-15: Completed work unit 1
  - Added shared site config for service name, default description, and site URL resolution
  - Replaced placeholder root metadata with production metadata defaults
  - Added `%s | 모움.zip` title template
- 2026-04-15: Completed work unit 2
  - Added App Router metadata routes for `robots.txt` and `sitemap.xml`
  - Limited sitemap coverage to `/` and `/search`
  - Limited robots disallow rules to `/api/` and `/oauth/`
  - Removed inaccurate sitemap `lastModified` timestamps instead of emitting request-time values
  - Validation note: file-level TypeScript syntax validation passed for `robots.ts` and `sitemap.ts`
  - Validation blocker: full workspace `tsc --noEmit` still reports broad pre-existing dependency and type issues outside this SEO scope
- 2026-04-15: Completed work unit 3
  - Replaced the invalid `/moim-detail` sitemap entry with real public meeting detail URLs fetched from the public meetings API
  - Added hourly revalidation to the dynamic sitemap route to avoid re-fetching on every request
  - Expanded `robots` disallow rules for clearly auth-required HTML routes
  - Added route-level `noindex` only for public auth pages (`/login`, `/signup`)
- 2026-04-15: Completed work unit 4
  - Added `/search` page metadata with route-owned `generateMetadata`
  - Indexed only the base `/search` route
  - Canonicalized filtered search states back to `/search` and returned `noindex`
- 2026-04-15: Completed follow-up refinement 1
  - Replaced the broken landing metadata file with a valid route-owned metadata module
  - Expanded the landing page description to reflect the real user journey: discovery, participation, and ongoing space-based collaboration
  - Validation note: focused TypeScript syntax validation passed for `app/(main)/page.tsx` and `landing-metadata.ts`
- 2026-04-15: Completed follow-up refinement 2
  - Added route-level `generateMetadata` for `moim-detail/[meetingId]`
  - Moved metadata composition into a dedicated moim-detail helper to keep `page.tsx` focused on rendering
  - Used public meeting detail data for title, description, canonical, and optional Open Graph image
  - Validation note: focused TypeScript syntax validation passed for `app/(main)/moim-detail/[meetingId]/page.tsx` and `get-moim-detail-metadata.ts`
- 2026-04-15: Completed follow-up refinement 3
  - Replaced the implicit `response.data ?? response` branch in moim-detail metadata with a named response parser
  - Split the inferred meeting detail type into response and payload aliases for readability
  - Aligned invalid `meetingId` handling so both `generateMetadata` and the page use the same `notFound()` path
  - Validation note: focused TypeScript syntax validation passed for the updated moim-detail page and metadata helper
- 2026-04-15: Completed follow-up refinement 4
  - Added narrow intent comments in `moim-detail/[meetingId]/page.tsx` only around the new SEO-related control flow
  - Clarified why `meetingId` parsing is shared between rendering and metadata generation
  - Clarified that route ownership stays in the page while metadata composition remains delegated to the helper
  - Validation note: focused TypeScript syntax validation passed for the updated moim-detail page

## Scoreboard

- Current score: 90
- Score source: provisional
- Last updated: 2026-04-15
- Score rationale: Public entry routes now have dedicated metadata, and the moim-detail follow-up now also leaves clear local intent at the exact route-level integration points.
- What improved: `moim-detail/[meetingId]` now keeps route behavior and metadata behavior aligned on invalid params, the metadata helper is easier to read because response normalization is explicit, and the page file explains the SEO-specific control points without broad comments.
- What remains unsatisfactory: Final end-to-end build validation is still blocked by broad existing workspace dependency and type issues outside this SEO scope.
- Next score action: Verify runtime metadata outputs for the final public routes and close out the SEO cleanup.

## Score History

- 2026-04-15: 50 (provisional) - Work unit 1 complete and work unit 2 queued
- 2026-04-15: 60 (provisional) - Work unit 2 complete, validation limited by existing workspace issues
- 2026-04-15: 75 (provisional) - Work unit 3 complete with corrected sitemap coverage and refined crawl/index controls
- 2026-04-15: 82 (provisional) - `/search` metadata complete and landing metadata refined for the public entry page
- 2026-04-15: 87 (provisional) - public detail-page metadata added with route-local helper composition
- 2026-04-15: 89 (provisional) - detail-page metadata follow-up improved readability and invalid param handling
- 2026-04-15: 90 (provisional) - added route-level intent comments for the moim-detail SEO integration points
