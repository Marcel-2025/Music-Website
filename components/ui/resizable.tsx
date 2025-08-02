"use client"

import { Panel, PanelGroup, type PanelGroupProps, ResizeHandle, type ResizeHandleProps } from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({ className, ...props }: PanelGroupProps) => (
  <PanelGroup
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
)

const ResizablePanel = Panel

const ResizableHandle = ({ withHandle, className, ...props }: ResizeHandleProps & { withHandle?: boolean }) => (
  <ResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:h-full after:w-[100px] after:bg-background after:content-[''] data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:h-[100px] data-[panel-group-direction=vertical]:after:w-full",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <svg
          className="h-2.5 w-2.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M9 6v12" />
          <path d="M15 6v12" />
        </svg>
      </div>
    )}
  </ResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
