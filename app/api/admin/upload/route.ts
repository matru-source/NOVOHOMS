import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { saveUploadedMedia } from "@/lib/media-store";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const mimeType = file.type || "image/jpeg";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported image type (${mimeType}). Please upload JPG, PNG, WebP, GIF, AVIF or SVG.` },
        { status: 400 }
      );
    }

    // Limit to 12MB
    const MAX_SIZE = 12 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image is too large. Please upload an image under 12MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const filename = (file as { name?: string }).name || `upload-${Date.now()}.jpg`;

    const result = await saveUploadedMedia(filename, mimeType, file.size, base64Data);

    return NextResponse.json({
      success: true,
      url: result.url,
      id: result.id,
      filename: result.filename,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image." },
      { status: 500 }
    );
  }
}
