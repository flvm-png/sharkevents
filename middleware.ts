import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rotas que exigem sessão iniciada.
const PROTECTED_ROUTES = ["/dashboard", "/create", "/checkin"];

// Rotas que não fazem sentido para quem já tem sessão.
const AUTH_ROUTES = ["/login", "/register"];

// Mantém os cookies de sessão refrescados também nos redirecionamentos.
function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname, search } = req.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Valida o token com o Supabase e refresca a sessão, se necessário.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sem sessão numa rota protegida → login, a guardar o destino.
  if (!user && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return redirectWithCookies(loginUrl, res);
  }

  // Com sessão em login/registo → dashboard.
  if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return redirectWithCookies(new URL("/dashboard", req.url), res);
  }

  return res;
}

export const config = {
  // Tudo menos assets estáticos, imagens do Next, API e ficheiros com extensão.
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico|.*\\..*).*)"],
};
