"use client";
import { useState } from "react";
export default function PredictForm() {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [l, setL] = useState(false);
  async function onSubmit(e: any) {
    e.preventDefault();
    setL(true);
    localStorage.setItem("2050eu.answers", JSON.stringify({ q1, q2, q3 }));
    window.location.href = "/result";
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl mx-auto">
      <input
        value={q1}
        onChange={(e) => setQ1(e.target.value)}
        placeholder="Qual é a sua profissão?"
        className="border p-2 w-full"
        required
      />
      <input
        value={q2}
        onChange={(e) => setQ2(e.target.value)}
        placeholder="Qual é o seu maior sonho?"
        className="border p-2 w-full"
        required
      />
      <input
        value={q3}
        onChange={(e) => setQ3(e.target.value)}
        placeholder="Em que cidade você vive?"
        className="border p-2 w-full"
        required
      />
      <button disabled={l} className="bg-black text-white px-4 py-2 rounded">
        {l ? "Aguarde..." : "Ver minha previsão"}
      </button>
    </form>
  );
}
