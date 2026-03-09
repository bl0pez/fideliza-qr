"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface PlanSubmitButtonProps {
  isPopular: boolean;
  label: string;
}

export function PlanSubmitButton({ isPopular, label }: PlanSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center justify-center w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${
        isPopular
          ? "bg-white text-slate-900 hover:bg-primary hover:text-white shadow-xl shadow-white/5"
          : "bg-slate-900 text-white hover:bg-primary shadow-xl shadow-black/10"
      }`}
    >
      {pending ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        label
      )}
    </button>
  );
}
