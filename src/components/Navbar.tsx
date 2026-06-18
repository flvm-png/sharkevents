import Link from "next/link";
import { getUser } from "@/lib/supabase/getUser";

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-semibold text-lg text-white">
          SharkEvents
        </Link>

        <nav className="flex items-center gap-6 text-sm text-zinc-300">

          {/* sempre visível */}
          <Link href="/" className="hover:text-white transition">
            Eventos
          </Link>

          {user && (
            <Link href="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
          )}

          {user ? (
            <form action="/api/auth/logout" method="post">
              <button className="text-red-400 hover:text-red-300 transition">
                Logout
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="hover:text-white transition">
                Login
              </Link>

              <Link href="/register" className="hover:text-white transition">
                Registo
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}