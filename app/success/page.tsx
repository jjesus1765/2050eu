"use client";
import { useEffect, useState } from "react";
type PredictResp = {
  texto: string;
  imgDataUrl: string;
  pdfBase64?: string | null;
  error?: string;
};
export default function SuccessPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [l, setL] = useState(true);
  useEffect(() => {
    (async () => {
      const raw = localStorage.getItem("2050eu.answers");
      if (!raw) {
        setL(false);
        return;
      }
      const { q1, q2, q3 } = JSON.parse(raw);
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q1, q2, q3, paid: true }),
      });
      const json: PredictResp = await res.json();
      if (res.ok && json.pdfBase64) {
        const url = URL.createObjectURL(b64toBlob(json.pdfBase64, "application/pdf"));
        setPdfUrl(url);
      }
      setL(false);
    })();
  }, []);
  function b64toBlob(b64: string, type: string) {
    const byteChars = atob(b64);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNums);
    return new Blob([byteArray], { type });
  }
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Pagamento confirmado ✅</h1>
      {l && <p>Gerando o seu PDF…</p>}
      {!l && pdfUrl && (
        <a
          href={pdfUrl}
          download="2050eu-previsao.pdf"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Baixar PDF
        </a>
      )}
      {!l && !pdfUrl && <p>Não foi possível gerar o PDF agora. Tente novamente.</p>}
    </main>
  );
}
