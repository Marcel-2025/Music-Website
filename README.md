# Ehhm.s Music Release Dashboard

This is a Next.js application designed to track music releases and artist statistics across various platforms like Spotify, YouTube, Apple Music, and Amazon Music.

## Features

- **Dashboard Overview**: Get a quick glance at total followers, monthly listeners, YouTube views, and subscribers.
- **Platform-specific Statistics**: View detailed stats for each connected music platform.
- **Latest Releases**: See your most recent music releases with cover art, platform, release date, and links.
- **Social Media Integration**: Links to your social profiles.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **API Integrations**: Connects with Spotify, YouTube, Apple Music, and Amazon Music APIs to fetch live data.

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your-username/ehhms-music-app.git
cd ehhms-music-app
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Set up Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

\`\`\`
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_ARTIST_ID=your_spotify_artist_id
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_youtube_channel_id
APPLE_MUSIC_ARTIST_ID=your_apple_music_artist_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # Or your Vercel deployment URL
\`\`\`

-   **SPOTIFY_CLIENT_ID**, **SPOTIFY_CLIENT_SECRET**: Obtain these from the [Spotify for Developers Dashboard](https://developer.spotify.com/dashboard/).
-   **SPOTIFY_ARTIST_ID**: Find your artist ID on Spotify (e.g., from your artist page URL).
-   **YOUTUBE_API_KEY**: Get this from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Enable the YouTube Data API v3.
-   **YOUTUBE_CHANNEL_ID**: Find your YouTube channel ID (e.g., from your channel URL).
-   **APPLE_MUSIC_ARTIST_ID**: This is a placeholder. Apple Music API integration requires more complex authentication (MusicKit JS or server-side token generation). For simplicity, this app uses a mock for Apple Music data.
-   **NEXT_PUBLIC_BASE_URL**: Set this to your local development URL (`http://localhost:3000`) or your Vercel deployment URL when deploying.

### 4. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project can be easily deployed to [Vercel](https://vercel.com).

1.  **Link your Git repository** (GitHub, GitLab, or Bitbucket) to Vercel.
2.  **Add your Environment Variables** in the Vercel project settings under "Environment Variables". Make sure to add all variables from your `.env.local` file.
3.  **Deploy!** Vercel will automatically build and deploy your application.

## Project Structure

\`\`\`
.
├── app/
│   ├── api/
│   │   ├── amazon-music/
│   │   ├── apple-music/
│   │   ├── releases/
│   │   ├── spotify/
│   │   ├── youtube/
│   │   └── ...
│   ├── dashboard/
│   ├── setup/
│   ├── success/
│   ├── test-spotify/
│   ├── setup-youtube/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn/ui components)
│   └── theme-provider.tsx
├── hooks/
│   ├── use-mobile.ts
│   ├── use-music-data.ts
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── public/
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── styles/
│   └── globals.css
├── .env.local
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
\`\`\`

## Contributing

Feel free to open issues or pull requests if you have suggestions or improvements!
\`\`\`

Hier ist der vollständige Inhalt für `lib/utils.ts`:
