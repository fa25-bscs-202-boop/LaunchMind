import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[rgba(8,8,8,0.82)]">
      <nav className="container-page flex h-[72px] items-center">
        <Link
          href="/"
          className="text-[1.05rem] font-bold tracking-[-0.02em] text-[var(--text)]"
        >
          LaunchMind AI
        </Link>
      </nav>
    </header>
  );
}





