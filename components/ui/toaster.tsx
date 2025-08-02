"use client"

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@radix-ui/react-toast"
import { Toaster as Sonner } from "@/components/ui/sonner"

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }

export function Toaster() {
  return (
    <ToastProvider>
      <Sonner />
      <ToastViewport />
    </ToastProvider>
  )
}
