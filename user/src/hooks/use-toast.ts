"use client";

import * as React from "react";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function useToast() {
  // State to manage toasts
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  // Function to trigger a new toast
  const toast = ({
    title,
    description,
    variant = "default",
    duration = 5000,
    ...props
  }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9); // Generate unique ID for toast
    setToasts((prev) => [
      ...prev,
      { id, title, description, variant, duration, ...props },
    ]);
  };

  // Function to dismiss a toast
  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    toast,
    dismiss,
    toasts, // Expose toasts for rendering in a ToastProvider
  };
}