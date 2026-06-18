export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-zinc-400">
        <p>
          SHARKCODERS © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}