import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const isVideo = file.type.startsWith("video/");
      // Stock visual fallback or mock uploaded asset URL
      const mockUrl = isVideo
        ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&fit=crop&q=80";

      return NextResponse.json({
        url: mockUrl,
        name: file.name,
        size: file.size,
        type: isVideo ? "video" : "image",
      });
    }

    // JSON fallback for URL input
    const { url, type } = await req.json();
    return NextResponse.json({
      url: url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&fit=crop&q=80",
      type: type || "image",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
