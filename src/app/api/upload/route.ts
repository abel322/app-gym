import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    // Limitar el tamaño a 2MB para evitar strings muy pesados en Base64
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "El archivo es demasiado grande (Máximo 2MB)." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convertir la imagen a Base64 (Data URL) para guardarla directamente en la base de datos
    // Esto evita problemas de escritura en el sistema de archivos (fs) y errores 500 en Vercel
    const mimeType = file.type || "image/jpeg";
    const base64String = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    return NextResponse.json({ 
      success: true, 
      url: dataUrl 
    });
  } catch (error: any) {
    console.error("Error procesando archivo (Upload API):", error.message || error);
    return NextResponse.json({ error: "Fallo al procesar la imagen." }, { status: 500 });
  }
}
