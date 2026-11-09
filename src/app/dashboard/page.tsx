"use client";

import { firebaseAuth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) router.replace("/login");
    });
  }, [router]);

  async function closeSession() {
    setIsSigningOut(true);
    setError("");
    try {
      await signOut(firebaseAuth);
    } catch {
      setError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
      setIsSigningOut(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-margin-mobile text-on-surface">
      <section className="w-full max-w-lg space-y-4 rounded-xl border border-outline-variant/50 bg-surface-container p-space-lg">
        <h1 className="text-headline-lg">Panel de DevAtlas</h1>
        {user ? (
          <>
            <p role="status" className="text-body-md text-tertiary">
              Iniciaste sesión correctamente.
            </p>
            <p className="break-words text-body-md text-on-surface-variant">
              Cuenta activa: {user.displayName || user.email}
            </p>
            <button
              type="button"
              onClick={closeSession}
              disabled={isSigningOut}
              className="rounded-lg bg-primary-container px-4 py-2 text-on-primary disabled:cursor-wait disabled:opacity-70"
            >
              {isSigningOut ? "Cerrando sesión…" : "Cerrar sesión"}
            </button>
            {error && <p role="alert" className="text-error">{error}</p>}
          </>
        ) : (
          <p role="status" className="text-body-md text-on-surface-variant">
            Verificando tu sesión…
          </p>
        )}
      </section>
    </main>
  );
}
