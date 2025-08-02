# Music Release Web App

This is a web application designed to showcase music releases and artist information, integrating with various streaming platforms like Spotify, YouTube, Apple Music, and Amazon Music.

## Features

- **Artist Profile**: Displays artist name, photo, and a brief description.
- **Platform Statistics**: Shows follower/subscriber counts from connected streaming platforms.
- **Latest Releases**: Lists music releases with cover art, title, artist, release date, and links to streaming services.
- **Social Media Links**: Provides links to the artist's social media profiles.
- **Responsive Design**: Optimized for various screen sizes.

## Technologies Used

- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- Lucide React Icons

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:
   \`\`\`bash
   git clone <repository-url>
   cd music-release-web-app
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root of your project and add the following environment variables. You will need to obtain API keys and IDs from the respective platforms.

   \`\`\`
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_ARTIST_ID=your_spotify_artist_id
   YOUTUBE_API_KEY=your_youtube_api_key
   YOUTUBE_CHANNEL_ID=your_youtube_channel_id
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   \`\`\`
   - `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_ARTIST_ID`: For Spotify API integration.
   - `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`: For YouTube Data API integration.
   - `NEXT_PUBLIC_BASE_URL`: The base URL of your application (e.g., `http://localhost:3000` for local development).

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application can be easily deployed to Vercel.

1. **Connect your Git repository**:
   Go to [Vercel Dashboard](https://vercel.com/dashboard) and import your Git repository.

2. **Configure Environment Variables**:
   Add the environment variables listed in step 3 of "Getting Started" to your Vercel project settings.

3. **Deploy**:
   Vercel will automatically build and deploy your application.

## Project Structure

- `app/`: Contains Next.js App Router pages and API routes.
- `components/`: Reusable React components, including shadcn/ui components.
- `hooks/`: Custom React hooks for data fetching and other logic.
- `lib/`: Utility functions.
- `public/`: Static assets like images.
- `styles/`: Global CSS styles.

## API Endpoints

- `/api/releases`: Fetches combined release data from all integrated platforms.
- `/api/spotify`: Fetches Spotify artist data.
- `/api/spotify/search-artist`: Searches for a Spotify artist.
- `/api/youtube`: Fetches YouTube channel data.
- `/api/youtube/search-channel`: Searches for a YouTube channel.
- `/api/apple-music`: Fetches mock Apple Music data.
- `/api/amazon-music`: Fetches mock Amazon Music data.
- `/api/setup-check`: Checks the status of API connections.

## Customization

- **Styling**: Modify `app/globals.css` and Tailwind CSS classes for design changes.
- **Data Integration**: Extend API routes in `app/api/` to integrate with more streaming services.
- **Content**: Update text and images in `app/page.tsx` to match your artist's branding.

## Contributing

Feel free to fork this repository and contribute.
\`\`\`

Hier ist der vollständige Inhalt für `lib/utils.ts`:
