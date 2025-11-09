export async function gerarTexto({ q1, q2, q3 }: { q1: string; q2: string; q3: string }) {
  const apiKey = process.env.XAI_API_KEY;
  const model = process.env.GROK_MODEL || "grok-2-latest";
  if (!apiKey) throw new Error("XAI_API_KEY não definido");
  const prompt = `Cria uma previsão divertida e positiva para 2050. q1=${q1}; q2=${q2}; q3=${q3}`;
  const resp = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Tu és um copywriter criativo." },
        { role: "user", content: prompt },
      ],
      temperature: 1.1,
      max_tokens: 220,
    }),
  });
  if (!resp.ok) {
    throw new Error("Falha Grok");
  }
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content?.trim() || "Em 2050…";
}
export async function gerarImagem({ prompt }: { prompt: string }) {
  const apiKey = process.env.BFL_API_KEY;
  const base = (process.env.BFL_BASE_URL || "https://api.bfl.ai").replace(/\/+$/, "");
  const route = process.env.BFL_ROUTE || "flux-pro-1.1";
  if (!apiKey) throw new Error("BFL_API_KEY não definido");
  const submit = await fetch(`${base}/v1/${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-key": apiKey,
      accept: "application/json",
    },
    body: JSON.stringify({ prompt, aspect_ratio: "1:1" }),
  });
  if (!submit.ok) throw new Error("Falha Flux submit");
  const subData = await submit.json();
  const polling = subData?.polling_url;
  const started = Date.now();
  while (Date.now() - started < 60000) {
    await new Promise((r) => setTimeout(r, 700));
    const poll = await fetch(polling, {
      headers: { accept: "application/json", "x-key": apiKey },
    });
    if (!poll.ok) continue;
    const jd = await poll.json();
    if (jd?.status === "Ready") {
      const url = jd?.result?.sample;
      const imgResp = await fetch(url);
      const buf = await imgResp.arrayBuffer();
      return Buffer.from(buf);
    }
  }
  throw new Error("Tempo esgotado a gerar imagem");
}
