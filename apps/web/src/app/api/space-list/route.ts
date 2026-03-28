import { NextResponse } from "next/server";
import { getSpaceListRemote } from "@/_pages/spaces/use-cases/get-space-list";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const data = await getSpaceListRemote(cursor);

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to fetch space list" }, { status: 500 });
  }
}
