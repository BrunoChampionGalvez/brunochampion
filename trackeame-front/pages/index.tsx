import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-purple-900">
      <Head>
        <title>Trackeame - Tracker de hábitos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center text-slate-100">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Trackeame
          </h1>
          <p className="text-lg md:text-xl mb-12 text-slate-200 max-w-2xl mx-auto">
                    Una herramienta simple y poderosa para rastrear el tiempo invertido en tus hábitos.
                    Construye mejores hábitos midiendo tu progreso.
          </p>
          
          <div className="flex gap-4 justify-center">
            {loading ? (
              <div className="flex gap-4" aria-hidden>
                <div className="px-16 py-3 rounded-full bg-white/10 animate-pulse" />
                <div className="px-16 py-3 rounded-full bg-white/5 animate-pulse" />
              </div>
            ) : user ? (
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-linear-to-r from-emerald-400 to-emerald-500 text-slate-900 rounded-full font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:-translate-y-1 transition-all"
              >
                Ir al Panel
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-8 py-3 bg-linear-to-r from-emerald-400 to-emerald-500 text-slate-900 rounded-full font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:-translate-y-1 transition-all"
                >
                  Comenzar
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white/10 border border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl shadow-purple-900/20 border border-white/80">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trackea Tiempo</h3>
              <p className="text-slate-600">Inicia y detén temporizadores para tus hábitos con facilidad</p>
            </div>
            <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl shadow-purple-900/20 border border-white/80">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ver Métricas</h3>
              <p className="text-slate-600">Ve el tiempo invertido semanal y mensualmente en cada hábito</p>
            </div>
            <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl shadow-purple-900/20 border border-white/80">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Construye Hábitos</h3>
              <p className="text-slate-600">Crea y administra múltiples hábitos sin esfuerzo</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
