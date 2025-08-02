# Ehhm.s Music Website

This is a Next.js application to track and display music releases and artist statistics from various platforms like Spotify, YouTube, Apple Music, and Amazon Music.

## Getting Started

1.  **Clone the repository:**
    \`\`\`bash
    git clone <repository-url>
    cd ehhms-music-app
    \`\`\`
2.  **Install dependencies:**
    \`\`\`bash
    pnpm install
    \`\`\`
3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your API keys and IDs:
    \`\`\`
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIFY_ARTIST_ID=your_spotify_artist_id
    YOUTUBE_API_KEY=your_youtube_api_key
    YOUTUBE_CHANNEL_ID=your_youtube_channel_id
    NEXT_PUBLIC_BASE_URL=http://localhost:3000 # For local development, use your deployed URL for production
    \`\`\`
    **Important for Vercel Deployment:** Ensure `NEXT_PUBLIC_BASE_URL` is set to your actual Vercel deployment URL in your Vercel project settings (Environment Variables). For example, `https://your-app-name.vercel.app`.

4.  **Run the development server:**
    \`\`\`bash
    pnpm dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Contains Next.js App Router pages and API routes.
    -   `api/`: Backend API routes for fetching data from music platforms.
    -   `dashboard/`: Dashboard page.
    -   `setup/`: Pages for setting up API integrations.
    -   `success/`: Success page after setup.
    -   `page.tsx`: The main landing page displaying releases.
    -   `layout.tsx`: Root layout for the application.
-   `components/ui/`: Shadcn UI components.
-   `hooks/`: Custom React hooks, e.g., `use-music-data.ts` for data fetching, `use-mobile.ts` for mobile detection.
-   `lib/utils.ts`: Utility functions like `cn` for Tailwind CSS class merging.
-   `public/`: Static assets like images.

## Features

-   **Music Release Tracking**: Displays latest releases from connected platforms.
-   **Platform Statistics**: Shows follower/subscriber counts for connected platforms.
-   **Responsive Design**: Adapts to different screen sizes with platform-specific navigation.
-   **API Integration**: Connects to Spotify, YouTube, Apple Music, and Amazon Music (placeholders for Apple/Amazon).
-   **Error Handling**: Provides feedback for API connection issues.

## Deployment

This project is designed to be deployed on Vercel.

1.  **Link your Git repository** to Vercel.
2.  **Configure Environment Variables** in your Vercel project settings (as mentioned in "Getting Started").
3.  Vercel will automatically build and deploy your application.

## Contributing

Feel free to open issues or pull requests if you have suggestions or find bugs.
