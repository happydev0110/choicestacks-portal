"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Check, X } from "lucide-react";
import styles from "./toast-provider.module.css";

type ToastKind = "success" | "error";
type Toast = { id: number; kind: ToastKind; message: string; duration: number };
type ToastApi = { success: (message: string) => void; error: (message: string) => void };
const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider.");
  return context;
}

function ToastCard({ toast, hidden, dismiss }: { toast: Toast; hidden: boolean; dismiss: (id: number) => void }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remaining = useRef(toast.duration);
  const paused = hidden || hovered || focused;
  const title = toast.kind === "success" ? "Success" : "Error";
  useEffect(() => {
    if (paused) return;
    const started = Date.now();
    const timer = window.setTimeout(() => dismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [paused, dismiss, toast.id]);

  return <div className={`${styles.toast} ${styles[toast.kind]}`}
    style={{ "--toast-duration": `${toast.duration}ms` } as CSSProperties}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); dismiss(toast.id); } }}>
    <div className={styles.progress} style={{ animationPlayState: paused ? "paused" : "running" }} aria-hidden="true" />
    <div className={styles.message} role={toast.kind === "error" ? "alert" : "status"} aria-atomic="true">
      <span className={styles.icon} aria-hidden="true">{toast.kind === "success" ? <Check size={24} strokeWidth={3} /> : <X size={24} strokeWidth={3} />}</span>
      <div className={styles.copy}><strong>{title}</strong><p>{toast.message}</p></div>
    </div>
    <button type="button" className={styles.close} aria-label={`Dismiss ${toast.kind} notification`} onClick={() => dismiss(toast.id)}><X size={14} /></button>
  </div>;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hidden, setHidden] = useState(false);
  const sequence = useRef(0);
  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const show = useCallback((kind: ToastKind, message: string) => {
    const toast = { id: ++sequence.current, kind, message, duration: kind === "error" ? 7000 : 5000 };
    setToasts((current) => current.some((item) => item.kind === kind && item.message === message)
      ? current : [toast, ...current].slice(0, 3));
  }, []);
  const api = useMemo(() => ({
    success: (message: string) => show("success", message),
    error: (message: string) => show("error", message),
  }), [show]);
  useEffect(() => {
    const update = () => setHidden(document.visibilityState === "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return <ToastContext.Provider value={api}>
    {children}
    <section className={styles.viewport} aria-label="Toast notifications">
      {toasts.map((toast) => <ToastCard key={toast.id} toast={toast} hidden={hidden} dismiss={dismiss} />)}
    </section>
  </ToastContext.Provider>;
}
