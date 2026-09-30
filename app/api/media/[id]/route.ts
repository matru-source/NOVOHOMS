import { NextResponse } from "next/server";
import { getUploadedMedia } from "@/lib/media-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rawId = (await params).id;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid media ID." }, { status: 400 });
    }

    const media = await getUploadedMedia(id);
    if (!media) {
      return NextResponse.json({ error: "Media not found." }, { status: 404 });
    }

    return new Response(new Uint8Array(media.buffer), {
      status: 200,
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": String(media.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${encodeURIComponent(media.filename)}"`,
      },
    });
  } catch (error) {
    console.error("Failed to serve media:", error);
    return NextResponse.json({ error: "Unable to load media." }, { status: 500 });
  }
}
