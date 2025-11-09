"use client";
import { useEffect, useState } from "react";
type PredictResp = {
  texto: string;
  imgDataUrl: string;
  pdfBase64?: string | null;
  error?: string;
};
export default function ResultCard() {
  const [data, setData] = useState<PredictResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const raw = localStorage.getItem("2050eu.answers");
      if (!raw) {
        setLoading(false);
        return;
      }
      const { q1, q2, q3 } = JSON.parse(raw);
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q1, q2, q3, paid: false }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Erro");
        setLoading(false);
        return;
      }
      setData(json);
      setLoading(false);
    })();
  }, []);
  async function comprar() {
    const raw = localStorage.getItem("2050eu.answers");
    const { q1, q2, q3 } = raw ? JSON.parse(raw) : { q1: "", q2: "", q3: "" };
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q1, q2, q3 }),
    });
    const j = await r.json();
    if (j.url) window.location.href = j.url;
  }
  if (loading) return <p>Gerando sua previsão…</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!data) return <p>Nada para mostrar.</p>;
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-xl">{data.texto}</p>
      {!!data.imgDataUrl && (
        <img src={data.imgDataUrl} alt="Previsão 2050" className="w-full rounded" />
      )}
      <button onClick={comprar} className="bg-green-600 text-white px-4 py-2 rounded">
        Baixar PDF por R$ 3,90
      </button>
    </div>
  );
}
