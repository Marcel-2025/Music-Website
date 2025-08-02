"use client"

import type * as React from "react"
import { useReducer, useEffect } from "react"
import type { ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 10000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type State = {
  toasts: ToasterToast[]
}

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string, dispatch: React.Dispatch<Action>) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toastId ? { ...t, open: false } : t)),
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

export const useToast = () => {
  const [state, dispatch] = useReducer(reducer, { toasts: [] })

  useEffect(() => {
    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout))
      toastTimeouts.clear()
    }
  }, [])

  const toast = (props: ToasterToast) => {
    const id = genId()
    const { open = true, ...toast } = props

    dispatch({
      type: "ADD_TOAST",
      toast: { ...toast, id, open },
    })

    if (open) {
      addToRemoveQueue(id, dispatch)
    }
  }

  const dismiss = (toastId?: string) => {
    dispatch({
      type: "DISMISS_TOAST",
      toastId,
    })
  }

  const remove = (toastId?: string) => {
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    })
  }

  return {
    toast,
    dismiss,
    remove,
    toasts: state.toasts,
  }
}
