"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

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
    router.push("/login");
    router.refresh();
  }

  function isActive(path: string) {
    return pathname === path;
  }

  const linkClass = (path: string) =>
    `transition ${
      isActive(path)
        ? "text-white font-semibold"
        : "text-zinc-400 hover:text-[#A855F7]"
    }`;

  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-xl
        bg-black/20
        border-b border-white/10
      "
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          href="/"
          className="text-white font-bold text-xl tracking-wide"
        >
          SharkEvents
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-6 text-sm">

          <Link href="/events" className={linkClass("/events")}>
            Eventos
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>

              <Link href="/create" className={linkClass("/create")}>
                Criar Evento
              </Link>

              <button
                onClick={logout}
                className="
                  text-[#F97316]
                  hover:text-[#fb923c]
                  transition
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>

              <Link href="/register" className={linkClass("/register")}>
                Registo
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}