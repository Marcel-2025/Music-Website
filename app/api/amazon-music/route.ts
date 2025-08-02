import { NextResponse } from "next/server"

export async function GET() {
  // Amazon Music does not have a public API for fetching artist releases or stats.
  // This route is a placeholder and will always return an empty array and disconnected status.
  // For demonstration, we'll return mock data with functional links.
  const mockReleases = [
    {
      id: "amz1",
      title: "Industrial Night",
      platform: "Amazon Music",
      releaseDate: "2025-07-30", // Future date to show as "NEW"
      streams: "N/A",
      image: "/placeholder.png?height=300&width=300",
      link: "https://music.amazon.de/albums/B0F89B4G8H", // Generic Amazon Music album link for Ehhm.s
      type: "Single",
      totalTracks: 1,
      artists: "Ehhm.s",
    },
    {
      id: "amz2",
      title: "Dawn of Emotions",
      platform: "Amazon Music",
      releaseDate: "2025-06-15",
      streams: "N/A",
      image: "/placeholder.png?height=300&width=300",
      link: "https://music.amazon.de/albums/B0F89B4G8H",
      type: "Single",
      totalTracks: 1,
      artists: "Ehhm.s",
    },
    {
      id: "amz3",
      title: "Dopamine Loops",
      platform: "Amazon Music",
      releaseDate: "2025-05-01",
      streams: "N/A",
      image: "/placeholder.png?height=300&width=300",
      link: "https://music.amazon.de/albums/B0F89B4G8H",
      type: "Single",
      totalTracks: 1,
      artists: "Ehhm.s",
    },
    {
      id: "amz4",
      title: "Feel the Energy",
      platform: "Amazon Music",
      releaseDate: "2025-04-20",
      streams: "N/A",
      image: "/placeholder.png?height=300&width=300",
      link: "https://music.amazon.de/albums/B0F89B4G8H",
      type: "Single",
      totalTracks: 1,
      artists: "Ehhm.s",
    },
    {
      id: "amz5",
      title: "Festival Rising",
      platform: "Amazon Music",
      releaseDate: "2025-03-10",
      streams: "N/A",
      image: "/placeholder.png?height=300&width=300",
      link: "https://music.amazon.de/albums/B0F89B4G8H",
      type: "Single",
      totalTracks: 1,
      artists: "Ehhm.s",
    },
    {
      id: "amz6",
      title: "Eternal Echoes",
      platform: "Amazon Music",
      releaseDate: "2025-02-05",
      streams: "N/A",
      image: "/placeholder.png?height=300&width=300",
      link: "https://music.amazon.de/albums/B0F89B4G8H",
      type: "Single",
      totalTracks: 1,
      artists: "Ehhm.s",
    },
    {
      id: "amz7",
      title: "Euphoric Rave",
      platform: "Amazon Music",
      releaseDate: "2025-01-20",
      streams: "N/A",
      image: "/placeholder.png?height=300&width=300",
      link: "https://music.amazon.de/albums/B0F89B4G8H",
      type: "Single",
      totalTracks: 1,
      artists: "Ehhm.s",
    },
    {
      id: "amz8",
      title: "Echoes of Minimalismus",
      platform: "Amazon Music",
      releaseDate: "2024-12-01",
      streams: "N/A",
      image: "/placeholder.png?height=300&width=300",
      link: "https://music.amazon.de/albums/B0F89B4G8H",
      type: "Single",
      totalTracks: 1,
      artists: "Ehhm.s",
    },
  ]

  const stats = {
    platform: "Amazon Music",
    followers: 15000,
    monthlyListeners: 80000,
  }

  return NextResponse.json({
    success: true,
    releases: mockReleases,
    artist: {
      name: "Ehhm.s",
      followers: 12345, // Mock followers for display
      image: "/placeholder.png?height=200&width=200",
      genres: ["Electronic", "Ambient", "Synthwave"],
      popularity: 75, // Mock popularity
    },
    connected: true, // Indicate connection for UI purposes
    stats: stats,
  })
}
