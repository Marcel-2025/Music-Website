import { NextResponse } from "next/server"

export async function GET() {
  // Mock data for Amazon Music
  const mockReleases = [
    {
      id: "am1",
      title: "Industrial Night",
      platform: "Amazon Music",
      releaseDate: "2024-07-20",
      streams: "1.2M",
      image: "/placeholder.png?height=300&width=300&query=album cover industrial night",
      link: "https://music.amazon.de/albums/B0C73J1234",
      type: "Single",
      artists: "Ehhm.s",
      isNew: true,
    },
    {
      id: "am2",
      title: "Cybernetic Dreams",
      platform: "Amazon Music",
      releaseDate: "2024-06-15",
      streams: "850K",
      image: "/placeholder.png?height=300&width=300&query=album cover cybernetic dreams",
      link: "https://music.amazon.de/albums/B0C73J5678",
      type: "EP",
      artists: "Ehhm.s",
      isNew: false,
    },
  ]

  const mockPlatformStats = {
    amazonMusic: {
      followers: 15000,
      name: "Ehhm.s",
      connected: true,
    },
  }

  const mockArtistData = {
    name: "Ehhm.s",
    followers: 15000,
    image: "/placeholder-user.jpg",
    genres: ["Electronic", "Industrial", "Techno"],
    popularity: 70,
  }

  return NextResponse.json({
    releases: mockReleases,
    platformStats: mockPlatformStats,
    artistData: mockArtistData,
  })
}
