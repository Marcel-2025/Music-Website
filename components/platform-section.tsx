"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Grid3x3, List, LayoutGrid, Minimize2, Maximize2, Settings2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"
import { Play, ExternalLink, Eye, Music } from "lucide-react"
import type { ViewMode, GridSize } from "@/hooks/use-view-preferences"

interface Release {
  id: string
  title: string
  platform: string
  releaseDate: string
  streams: string
  image: string
  link: string
  type: string
  totalTracks?: number
  artists?: string
  views?: number
  isNew?: boolean
}

interface PlatformSectionProps {
  platform: string
  icon: React.ComponentType<any>
  color: string
  releases: Release[]
  visible: boolean
  viewMode: ViewMode
  gridSize: GridSize
  onToggleVisibility: () => void
  onChangeViewMode: (mode: ViewMode) => void
  onChangeGridSize: (size: GridSize) => void
  platformBgColor: string
}

export function PlatformSection({
  platform,
  icon: Icon,
  color,
  releases,
  visible,
  viewMode,
  gridSize,
  onToggleVisibility,
  onChangeViewMode,
  onChangeGridSize,
  platformBgColor,
}: PlatformSectionProps) {
  const getGridColumns = () => {
    if (viewMode === "compact") {
      switch (gridSize) {
        case "small":
          return "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12"
        case "medium":
          return "grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
        case "large":
          return "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
      }
    }

    switch (gridSize) {
      case "small":
        return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
      case "medium":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      case "large":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
  }

  const ReleaseCard = ({ release, compact = false }: { release: Release; compact?: boolean }) => (
    <Card
      className={`bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group overflow-hidden ${
        compact ? "hover:scale-105" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={release.image || "/placeholder.svg?height=400&width=400"}
            alt={release.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button asChild size={compact ? "sm" : "lg"} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Link href={release.link} target="_blank" rel="noopener noreferrer">
                <Play className={compact ? "w-4 h-4" : "w-5 h-5 md:w-6 md:h-6"} />
              </Link>
            </Button>
          </div>
          {release.isNew && <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">NEW</Badge>}
          <div className="absolute top-2 left-2">
            <Icon className={`${compact ? "w-4 h-4" : "w-5 h-5 md:w-6 md:h-6"} ${color}`} />
          </div>
        </div>
        {!compact && (
          <div className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-gray-400">{release.platform}</span>
            </div>
            <h4 className="text-sm md:text-base font-semibold text-white mb-1 line-clamp-2">{release.title}</h4>
            {release.artists && <p className="text-xs text-gray-400 mb-2 line-clamp-1">{release.artists}</p>}
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span>{new Date(release.releaseDate).toLocaleDateString()}</span>
              <span className="flex items-center gap-1">
                {release.platform === "YouTube" ? <Eye className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                {release.streams}
              </span>
            </div>
            <Button
              asChild
              className={`w-full bg-gradient-to-r ${platformBgColor} text-xs md:text-sm touch-manipulation`}
              size="sm"
            >
              <Link href={release.link} target="_blank" rel="noopener noreferrer">
                {release.platform === "YouTube" ? "Watch" : "Listen"}
                <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const ListItem = ({ release }: { release: Release }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-all group">
      <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
        <Image
          src={release.image || "/placeholder.svg?height=80&width=80"}
          alt={release.title}
          fill
          className="object-cover rounded"
        />
        {release.isNew && <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">NEW</Badge>}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm md:text-base font-semibold text-white truncate">{release.title}</h4>
        {release.artists && <p className="text-xs text-gray-400 truncate">{release.artists}</p>}
        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
          <span>{new Date(release.releaseDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-1">
            {release.platform === "YouTube" ? <Eye className="w-3 h-3" /> : <Music className="w-3 h-3" />}
            {release.streams}
          </span>
        </div>
      </div>
      <Button asChild size="sm" className={`bg-gradient-to-r ${platformBgColor} flex-shrink-0`}>
        <Link href={release.link} target="_blank" rel="noopener noreferrer">
          <Play className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  )

  return (
    <div className="mb-8 md:mb-12">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <Icon className={`w-6 h-6 md:w-8 md:h-8 ${color}`} />
          <h4 className="text-lg md:text-2xl font-semibold text-white">{platform}</h4>
          <Badge variant="outline" className={`${color} border-current text-xs`}>
            {releases.length}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings2 className="w-4 h-4" />
                <span className="hidden sm:inline">View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>View Mode</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onChangeViewMode("grid")} className="gap-2">
                <Grid3x3 className="w-4 h-4" />
                Grid View
                {viewMode === "grid" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeViewMode("compact")} className="gap-2">
                <Minimize2 className="w-4 h-4" />
                Compact Grid
                {viewMode === "compact" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeViewMode("carousel")} className="gap-2">
                <LayoutGrid className="w-4 h-4" />
                Carousel
                {viewMode === "carousel" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeViewMode("list")} className="gap-2">
                <List className="w-4 h-4" />
                List View
                {viewMode === "list" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Grid Size</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onChangeGridSize("small")} className="gap-2">
                <Minimize2 className="w-4 h-4" />
                Small
                {gridSize === "small" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeGridSize("medium")} className="gap-2">
                <Grid3x3 className="w-4 h-4" />
                Medium
                {gridSize === "medium" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeGridSize("large")} className="gap-2">
                <Maximize2 className="w-4 h-4" />
                Large
                {gridSize === "large" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Collapse Toggle */}
          <Button variant="outline" size="sm" onClick={onToggleVisibility} className="gap-2 bg-transparent">
            {visible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="hidden sm:inline">{visible ? "Hide" : "Show"}</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {visible && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          {viewMode === "grid" && (
            <div className={`grid ${getGridColumns()} gap-3 md:gap-6`}>
              {releases.map((release) => (
                <ReleaseCard key={`${release.platform}-${release.id}`} release={release} />
              ))}
            </div>
          )}

          {viewMode === "compact" && (
            <div className={`grid ${getGridColumns()} gap-2 md:gap-3`}>
              {releases.map((release) => (
                <ReleaseCard key={`${release.platform}-${release.id}`} release={release} compact />
              ))}
            </div>
          )}

          {viewMode === "carousel" && (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {releases.map((release) => (
                  <CarouselItem
                    key={`${release.platform}-${release.id}`}
                    className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                  >
                    <ReleaseCard release={release} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          )}

          {viewMode === "list" && (
            <div className="space-y-2">
              {releases.map((release) => (
                <ListItem key={`${release.platform}-${release.id}`} release={release} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
