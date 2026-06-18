"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="text-white">A carregar...</div>;

  if (!user) {
    return <div className="text-white">Não autenticado</div>;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Bem vindo, {user.email} 👋</p>
    </div>
  );
}