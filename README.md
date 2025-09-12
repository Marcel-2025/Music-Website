# Music Release Web App

A modern web application for tracking music releases across multiple platforms including Spotify, YouTube, Apple Music, and Amazon Music.

## Features

- **Multi-Platform Integration**: Connect with Spotify, YouTube, Apple Music, and Amazon Music APIs
- **Release Tracking**: Monitor new releases from your favorite artists
- **Dashboard**: Clean, modern interface to view all your music data
- **Real-time Updates**: Get the latest information about new releases
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **APIs**: Spotify Web API, YouTube Data API, Apple Music API, Amazon Music API
- **Authentication**: JWT tokens for secure API access

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- API credentials for:
  - Spotify (Client ID, Client Secret)
  - YouTube (API Key)
  - Apple Music (optional)
  - Amazon Music (optional)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd music-release-web-app
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your API credentials:

\`\`\`env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_ARTIST_ID=your_spotify_artist_id
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_youtube_channel_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

4. Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── setup/            # Setup pages
│   └── globals.css       # Global styles
├── components/           # React components
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                # Utility functions
└── public/             # Static assets
\`\`\`

## API Routes

- `/api/spotify` - Spotify integration
- `/api/youtube` - YouTube integration  
- `/api/apple-music` - Apple Music integration
- `/api/amazon-music` - Amazon Music integration
- `/api/releases` - Combined release data

## Deployment

The app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
