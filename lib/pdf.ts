<<<<<<< Updated upstream
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
=======
import { pdf } from "@react-pdf/renderer";
import * as React from "react";
import { Document, Page, Text, Image, StyleSheet, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 14 },
  title: { fontSize: 24, marginBottom: 12 },
  img: { width: 400, height: 400, marginVertical: 16 },
  footer: { marginTop: 24, fontSize: 10, color: "#666" },
});

function PdfDoc(props: { texto: string; imgDataUrl: string }) {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4" as const, style: styles.page },
      React.createElement(Text, { style: styles.title }, "Sua previsão em 2050"),
      React.createElement(
        View,
        null,
        React.createElement(Text, null, props.texto),
        props.imgDataUrl
          ? React.createElement(Image, { src: props.imgDataUrl, style: styles.img })
          : null
      ),
      React.createElement(
        Text,
        { style: styles.footer },
        `2050eu — Gerado por IA • ${new Date().getFullYear()}`
      )
    )
  );
}

export async function gerarPdfBuffer({
  texto,
  imgBuffer,
}: {
  texto: string;
  imgBuffer: Buffer;
}) {
  const imgDataUrl = `data:image/png;base64,${imgBuffer.toString("base64")}`;
  const doc = React.createElement(PdfDoc, { texto, imgDataUrl });
  const instance = pdf(doc);
  const pdfBuffer = await instance.toBuffer();
  return pdfBuffer;
>>>>>>> Stashed changes
}
