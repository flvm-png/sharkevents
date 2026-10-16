import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cria o cliente Supabase para Server Components, Route Handlers e Server
// Actions. Lê a sessão do utilizador a partir dos cookies do pedido.
// Atenção: é assíncrono, por isso tem de ser chamado com `await createClient()`.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // `set` só funciona em Server Actions e Route Handlers.
            // Se for chamado a partir de um Server Component, a sessão
            // é refrescada pelo middleware, por isso o erro pode ser ignorado.
          }
        },
      },
    }
  );
}
