import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-base-200 h-screen border-r border-base-300 flex flex-col">
      <div className="p-8">
        <h1 className="text-3xl font-black tracking-tighter text-primary">
          BÚSSOLA
        </h1>
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">
          Módulo FUB 2025
        </p>
      </div>

      <nav className="flex-1 px-4">
        <ul className="menu menu-md gap-2">
          <li className="menu-title opacity-40 text-xs uppercase tracking-widest mt-4">
            Navegação
          </li>
          <li>
            <Link href="/" className="flex items-center gap-3 py-3">
              <span className="text-xl">📊</span>
              <span className="font-bold">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/ciclo" className="flex items-center gap-3 py-3">
              <span className="text-xl">🔄</span>
              <span className="font-bold">Ciclo de Estudos</span>
            </Link>
          </li>
          <li>
            <Link href="/exercicios" className="flex items-center gap-3 py-3">
              <span className="text-xl">🎯</span>
              <span className="font-bold">Banco de Itens</span>
            </Link>
          </li>

          <li className="menu-title opacity-40 text-xs uppercase tracking-widest mt-8">
            Análise de Performance
          </li>
          <li>
            <Link href="/revisoes" className="flex items-center gap-3 py-3">
              <span className="text-xl">📅</span>
              <span className="font-bold">Revisões (SRS)</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 py-3 opacity-50 cursor-not-allowed"
            >
              <span className="text-xl">📈</span>
              <span className="font-bold italic">Simulados (LMS)</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 bg-base-300 m-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-8">
              <span>AM</span>
            </div>
          </div>
          <div className="text-xs">
            <p className="font-bold">Alexandre Mir</p>
            <p className="opacity-50">Plano FUB Ativo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
