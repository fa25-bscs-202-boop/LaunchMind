import { AuthHeader } from "../components/AuthHeader";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <AuthHeader />
      <section className="flex min-h-[calc(100vh-72px)] items-center px-4 py-6 sm:py-8">
        <div className="container-page">
          <div className="animate-fade-up hover-lift mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20 sm:p-7">
            <h1 className="text-3xl font-bold tracking-[-0.04em]">
              Create your workspace.
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Start turning your ideas into structured startup plans.
            </p>

            <RegisterForm />
          </div>
        </div>
      </section>
    </main>
  );
}






