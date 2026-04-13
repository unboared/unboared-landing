"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Lock } from "lucide-react";

const COOKIE_NAME = "cineo_access";
const PASSWORD = "CINEO2026";

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge: number, path: string) {
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=${path};SameSite=Lax`;
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (getCookie(COOKIE_NAME) === "granted") {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === PASSWORD) {
      setCookie(COOKIE_NAME, "granted", 86400, "/cineo");
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  }

  if (checking) return null;

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg"
        >
          {/* Background atmosphere */}
          <div className="absolute inset-0 mesh-gradient opacity-40" />
          <div className="absolute inset-0 dot-grid opacity-[0.02]" />
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl"
          />

          <motion.form
            onSubmit={handleSubmit}
            animate={error ? { x: [0, -12, 12, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-sm mx-4 flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
              }}
              className="mb-10"
            >
              <Image
                src="/images/logos/unboared-logo.png"
                alt="Unboared"
                width={180}
                height={48}
                className="h-10 w-auto"
              />
            </motion.div>

            {/* Lock icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.1,
              }}
              className="mb-6 w-14 h-14 rounded-2xl bg-bg-card border border-border flex items-center justify-center"
            >
              <Lock className="w-6 h-6 text-text-muted" />
            </motion.div>

            {/* Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: 0.15,
              }}
              className="text-text-muted text-center text-sm mb-8 leading-relaxed"
            >
              Cette page est reservee aux adherents du reseau{" "}
              <span className="text-text font-semibold">CINEO</span>.
              <br />
              Saisissez le code d&apos;acces pour continuer.
            </motion.p>

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: 0.2,
              }}
              className="w-full mb-4"
            >
              <input
                type="password"
                placeholder="Code d'acces"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-bg-card border border-border text-text placeholder:text-text-dim text-center text-lg tracking-widest font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                autoFocus
              />
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-error text-sm mb-3"
                >
                  Code incorrect
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: 0.25,
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-4 rounded-xl bg-accent text-white font-bold text-lg glow-accent transition-shadow duration-300"
            >
              Acceder
            </motion.button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
