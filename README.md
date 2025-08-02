# Ehhm.s Music Release Web App

This is a web application designed to track and display music releases and artist statistics from various platforms like Spotify, YouTube, Apple Music, and Amazon Music.

## Features

- **Dashboard Overview**: See your latest releases and aggregated statistics from connected music platforms.
- **Platform Integrations**: Connect with Spotify, YouTube, Apple Music, and Amazon Music (mock data for Amazon Music due to API limitations).
- **Release Tracking**: View a chronological list of your music releases with details like title, platform, release date, and cover art.
- **Artist Statistics**: Get insights into your followers, subscribers, and views across different platforms.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/Marcel-2025/Ehhm.s---Music-Website.git
cd Ehhm.s---Music-Website
\`\`\`

### 2. Install Dependencies

Using pnpm:

\`\`\`bash
pnpm install
\`\`\`

### 3. Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables. You will need to obtain API keys and artist/channel IDs from the respective platforms.

\`\`\`
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_ARTIST_ID=your_spotify_artist_id

# YouTube Data API Credentials
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_youtube_channel_id

# Apple Music API Credentials (Developer Token)
# You need to generate a MusicKit Developer Token.
# Refer to Apple Music API documentation for details: https://developer.apple.com/documentation/musickit/generating_developer_tokens
APPLE_MUSIC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
APPLE_MUSIC_KEY_ID=your_apple_music_key_id
APPLE_MUSIC_TEAM_ID=your_apple_music_team_id
APPLE_MUSIC_ARTIST_ID=your_apple_music_artist_id

# Base URL for API calls (important for Vercel deployments)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

**Important Notes for Apple Music API:**
- The `APPLE_MUSIC_PRIVATE_KEY` should be the content of your `.p8` key file, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`, with actual newline characters (`\n`).
- `APPLE_MUSIC_KEY_ID` is the 10-character Key ID from your Apple Developer account.
- `APPLE_MUSIC_TEAM_ID` is your 10-character Team ID from your Apple Developer account.
- `APPLE_MUSIC_ARTIST_ID` is the ID of your artist on Apple Music.

### 4. Run the Development Server

\`\`\`bash
pnpm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Deployment

This project can be easily deployed to Vercel. Ensure your environment variables are configured in your Vercel project settings.

For `NEXT_PUBLIC_BASE_URL` on Vercel, you should set it to your deployment URL (e.g., `https://your-project-name.vercel.app`). Vercel automatically sets `VERCEL_URL` which you can use for this purpose in production.

## Project Structure

- `app/`: Next.js App Router routes and API endpoints.
  - `api/`: API routes for fetching data from Spotify, YouTube, Apple Music, and Amazon Music.
  - `dashboard/`: Dashboard page.
  - `setup/`: Setup pages for API integrations.
- `components/`: Reusable React components, including shadcn/ui components.
- `hooks/`: Custom React hooks for data fetching and other logic.
- `lib/`: Utility functions.
- `styles/`: Global CSS styles.

## Contributing

Feel free to fork the repository and contribute!

## License

[MIT License](LICENSE)
\`\`\`

Hier ist der vollständige Inhalt für `lib/utils.ts`:
