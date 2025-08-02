"use client"

import * as React from "react"
import type * as RechartsPrimitive from "recharts"
import {
  ChartContainer as RechartsChartContainer,
  type ChartContainerProps as RechartsChartContainerProps,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

// Define ChartConfig type
type ChartConfig = {
  [k: string]: {
    label?: string
    icon?: React.ComponentType
    color?: string
    theme?: {
      light?: string
      dark?: string
    }
  }
}

// Define ChartContext type
type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartProvider>")
  }
  return context
}

const ChartContainer = React.forwardRef<HTMLDivElement, RechartsChartContainerProps>(({ className, ...props }, ref) => (
  <RechartsChartContainer ref={ref} className={cn("flex aspect-video w-full", className)} {...props} />
))
ChartContainer.displayName = "ChartContainer"

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig.theme || itemConfig.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean
    nameKey?: string
  }) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className={cn("[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config]
}

type ChartProps = React.ComponentProps<"div"> & {
  config: Record<string, { label?: string; color?: string }>
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(({ className, children, config, ...props }, ref) => {
  const id = React.useId()
  if (!config || Object.keys(config).length === 0) {
    return null
  }
  return (
    <ChartContainer
      id={id}
      ref={ref}
      className={cn(
        "[&_.recharts-tooltip-content>div]:bg-background [&_.recharts-tooltip-content>div]:border-border [&_.recharts-tooltip-content>div]:text-foreground [&_.recharts-tooltip-content>div]:rounded-md [&_.recharts-tooltip-content>div]:px-2 [&_.recharts-tooltip-content>div]:py-1 [&_.recharts-tooltip-content>div]:shadow-md [&_.recharts-tooltip-item]:flex [&_.recharts-label]:font-medium [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-axis.recharts-yAxis_.recharts-cartesian-axis-tick:first-child_text]:fill-foreground [&_.recharts-cartesian-axis.recharts-yAxis_.recharts-cartesian-axis-tick:last-child_text]:fill-foreground [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-dot[stroke='#fff']]:stroke-current [&_.recharts-active-dot[stroke='#fff']]:stroke-current [&_.recharts-active-dot[r='8']]:stroke-white [&_.recharts-wrapper]:outline-none",
        className,
      )}
      config={config}
      {...props}
    >
      {children}
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    </ChartContainer>
  )
})
Chart.displayName = "Chart"

export { Chart, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent, useChart }
