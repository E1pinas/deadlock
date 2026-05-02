import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="p-8">
        <h2 className="text-4xl font-bold text-yellow-400">
          Inicio Deadlock
        </h2>

        <p className="mt-4 text-zinc-300">
          Página inicial del proyecto usando Next.js, TypeScript y Tailwind.
        </p>
      </section>
    </main>
  );
}