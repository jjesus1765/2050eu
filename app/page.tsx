import PredictForm from "@/components/PredictForm";
export default function Page() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">2050eu — Sua previsão do futuro</h1>
      <p className="mb-6">
        Responda 3 perguntas e receba uma previsão absurda gerada por IA.
      </p>
      <PredictForm />
    </main>
  );
}
