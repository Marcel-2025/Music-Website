"use client"

import * as React from "react"
import type { ToastProps, ToastActionElement } from "@radix-ui/react-toast"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@/components/ui/toaster"

const ToastComponent = React.forwardRef<
  React.ElementRef<typeof Toast>,
  ToastProps & {
    type?: "default" | "success" | "error" | "info" | "warning"
    action?: ToastActionElement
  }
>(({ className, type = "default", action, ...props }, ref) => {
  const Icon = React.useMemo(() => {
    switch (type) {
      case "success":
        return CheckCircle
      case "error":
        return XCircle
      case "info":
        return Info
      case "warning":
        return AlertTriangle
      default:
        return null
    }
  }, [type])

  return (
    <Toast
      ref={ref}
      className={cn(
        "group flex items-center gap-3",
        {
          "bg-green-500 text-white": type === "success",
          "bg-red-500 text-white": type === "error",
          "bg-blue-500 text-white": type === "info",
          "bg-yellow-500 text-white": type === "warning",
        },
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <div className="grid gap-1">
        {props.title && <ToastTitle>{props.title}</ToastTitle>}
        {props.description && <ToastDescription>{props.description}</ToastDescription>}
      </div>
      {action && <ToastAction {...action} />}
      <ToastClose />
    </Toast>
  )
})
ToastComponent.displayName = "ToastComponent"

export { ToastProvider, ToastViewport, ToastComponent as Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }
