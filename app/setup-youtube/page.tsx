"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import Image from "next/image"
import { CheckCircle2Icon, SearchIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

interface Channel {
  id: string
  name: string
  imageUrl: string
}

export default function SetupYoutube() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState(process.env.YOUTUBE_API_KEY || "")
  const [channelId, setChannelId] = useState(process.env.YOUTUBE_CHANNEL_ID || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

  const {
    data: searchResults,
    isLoading: isSearching,
    refetch: searchChannels,
  } = useQuery<Channel[], Error>({
    queryKey: ["youtubeSearch", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return []
      const response = await fetch(`/api/youtube/search-channel?query=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error("Failed to search YouTube channels")
      }
      const data = await response.json()
      return data.channels
    },
    enabled: false, // Only run when manually triggered
  })

  const handleSave = () => {
    // In a real application, you would save these to a database or environment variables
    // For this demo, we'll just show a toast.
    console.log("Saving YouTube API Key:", apiKey)
    console.log("Saving YouTube Channel ID:", channelId)
    toast({
      title: "YouTube Setup Saved!",
      description: "Your YouTube API key and channel ID have been saved.",
    })
  }

  const handleSearch = () => {
    if (searchQuery) {
      searchChannels()
    }
  }

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel)
    setChannelId(channel.id)
    setSearchQuery(channel.name) // Pre-fill search with selected channel name
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>YouTube Integration Setup</CardTitle>
          <CardDescription>Connect your YouTube channel to fetch new music video releases.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">YouTube API Key</Label>
            <Input
              id="apiKey"
              placeholder="Enter your YouTube Data API v3 key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">You can get your API key from the Google Cloud Console.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channelSearch">Search Channel</Label>
            <div className="flex space-x-2">
              <Input
                id="channelSearch"
                placeholder="Search for a YouTube channel by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : <SearchIcon className="h-4 w-4" />}
              </Button>
            </div>
            {searchResults && searchResults.length > 0 && (
              <Command className="rounded-lg border shadow-md">
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Channels">
                    {searchResults.map((channel) => (
                      <CommandItem
                        key={channel.id}
                        onSelect={() => handleSelectChannel(channel)}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Image
                          src={channel.imageUrl || "/placeholder.svg"}
                          alt={channel.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span>{channel.name}</span>
                        {selectedChannel?.id === channel.id && (
                          <CheckCircle2Icon className="ml-auto h-4 w-4 text-green-500" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="channelId">YouTube Channel ID</Label>
            <Input
              id="channelId"
              placeholder="Enter your YouTube Channel ID"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              disabled={!!selectedChannel} // Disable if a channel is selected via search
            />
            <p className="text-sm text-muted-foreground">
              This will be automatically filled if you select a channel from the search results.
            </p>
          </div>
          <Button onClick={handleSave}>Save YouTube Setup</Button>
        </CardContent>
      </Card>
    </div>
  )
}
