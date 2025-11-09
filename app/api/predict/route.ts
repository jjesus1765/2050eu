import { NextResponse } from "next/server";
import { gerarTexto, gerarImagem } from "@/lib/ai";
import { gerarPdfBuffer } from "@/lib/pdf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { q1, q2, q3, paid } = await req.json();

    if (!q1 || !q2 || !q3) {
      return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
    }

    const texto = await gerarTexto({ q1, q2, q3 });

    const imgBuf = await gerarImagem({
      prompt: `Poster futurista, ultra vívido, 2050: ${texto}`,
    });

    const imgDataUrl = `data:image/png;base64,${imgBuf.toString("base64")}`;

    let pdfBase64: string | null = null;
    if (paid) {
      const pdfBuf = await gerarPdfBuffer({ texto, imgBuffer: imgBuf });
      pdfBase64 = pdfBuf.toString("base64");
    }

    return NextResponse.json({ texto, imgDataUrl, pdfBase64 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}
