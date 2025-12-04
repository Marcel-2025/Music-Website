"use client"

import { useState, useEffect } from "react"

export type ViewMode = "grid" | "compact" | "carousel" | "list"
export type GridSize = "small" | "medium" | "large"

interface PlatformPreferences {
  isVisible: boolean
  viewMode: ViewMode
  gridSize: GridSize
}

interface AllPreferences {
  [platform: string]: PlatformPreferences
}

const DEFAULT_PREFERENCES: PlatformPreferences = {
  isVisible: true,
  viewMode: "grid",
  gridSize: "medium",
}

export function useViewPreferences() {
  const [preferences, setPreferences] = useState<AllPreferences>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("musicPlatformPreferences")
      if (stored) {
        setPreferences(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load preferences:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && Object.keys(preferences).length > 0) {
      try {
        localStorage.setItem("musicPlatformPreferences", JSON.stringify(preferences))
      } catch (error) {
        console.error("Failed to save preferences:", error)
      }
    }
  }, [preferences, isLoaded])

  const getPreferences = (platform: string): PlatformPreferences => {
    return preferences[platform] || DEFAULT_PREFERENCES
  }

  const updateViewMode = (platform: string, viewMode: ViewMode) => {
    setPreferences((prev) => ({
      ...prev,
      [platform]: {
        ...getPreferences(platform),
        viewMode,
      },
    }))
  }

  const updateGridSize = (platform: string, gridSize: GridSize) => {
    setPreferences((prev) => ({
      ...prev,
      [platform]: {
        ...getPreferences(platform),
        gridSize,
      },
    }))
  }

  const toggleVisibility = (platform: string) => {
    setPreferences((prev) => ({
      ...prev,
      [platform]: {
        ...getPreferences(platform),
        isVisible: !getPreferences(platform).isVisible,
      },
    }))
  }

  return {
    getPreferences,
    updateViewMode,
    updateGridSize,
    toggleVisibility,
    isLoaded,
  }
}
