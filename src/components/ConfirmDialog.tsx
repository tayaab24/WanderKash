"use client";

import { useEffect, useRef } from "react";
import { btn } from "@/lib/ui";

/** Small modal confirm built on <dialog> (focus trap, Escape and backdrop for free). */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault(); // Escape: route through onCancel so state stays in sync
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel(); // click on the backdrop
      }}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-line bg-surface p-0 text-fg shadow-[0_30px_60px_-20px_color-mix(in_srgb,var(--color-fg)_12%,transparent)] backdrop:bg-deep/45 backdrop:backdrop-blur-sm"
    >
      <div className="p-7">
        <h2 id="confirm-title" className="font-display text-2xl">
          {title}
        </h2>
        <p id="confirm-message" className="mt-3 text-sm leading-relaxed text-muted">
          {message}
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={btn.secondary}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className={btn.primary}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
