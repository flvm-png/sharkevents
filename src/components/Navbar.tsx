"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // estado inicial do user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // listener para login/logout em tempo real
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-zinc-950 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          href="/"
          className="text-white font-bold text-xl tracking-tight"
        >
          SharkEvents
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-5 text-sm text-zinc-300">

          <Link href="/" className="hover:text-white transition">
            Eventos
          </Link>

          {/* NEW: Create Event */}
          {user && (
            <Link
              href="/create"
              className="hover:text-white transition"
            >
              Criar Evento
            </Link>
          )}

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-white transition"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="text-zinc-300 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="hover:text-white transition"
              >
                Registo
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}