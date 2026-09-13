import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${folder}/${Date.now()}_${cleanName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const isVideo = file.type.startsWith("video/") || 
      cleanName.endsWith(".mp4") || 
      cleanName.endsWith(".webm") || 
      cleanName.endsWith(".mov");

    const mimeType = file.type || (isVideo ? "video/mp4" : "image/jpeg");

    // Upload to Supabase Storage with service role key
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("website-media")
      .upload(filePath, buffer, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("website-media")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    const detectedType = isVideo ? "video" : "image";

    // Register into public.media table
    try {
      await supabase.from("media").insert([
        {
          file_name: cleanName,
          storage_path: filePath,
          public_url: publicUrl,
          mime_type: mimeType,
          file_size: file.size,
          folder: folder,
          alt_text: cleanName.split(".")[0],
        },
      ]);
    } catch (dbErr) {
      console.warn("Failed to record media in database table:", dbErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: cleanName,
      mimeType: mimeType,
      mediaType: detectedType,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Server upload handler error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
