/**
 * Vercel Serverless Function — /api/spotify
 *
 * Uses the stored SPOTIFY_REFRESH_TOKEN to get a fresh access token,
 * then fetches the currently-playing track from the Spotify Web API.
 *
 * Required environment variables (set in Vercel dashboard):
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_REFRESH_TOKEN
 */

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

const getAccessToken = async (clientId, clientSecret, refreshToken) => {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  return res.json();
};

export default async function handler(req, res) {
  // Allow CORS from any origin (portfolio is static)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return res.status(500).json({ error: "Missing Spotify environment variables" });
  }

  try {
    const { access_token } = await getAccessToken(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET,
      SPOTIFY_REFRESH_TOKEN
    );

    const nowPlaying = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // 204 = nothing playing
    if (nowPlaying.status === 204 || nowPlaying.status > 400) {
      return res.status(200).json({ isPlaying: false });
    }

    const data = await nowPlaying.json();

    // Not a track (e.g. podcast episode)
    if (!data.item || data.item.type !== "track") {
      return res.status(200).json({ isPlaying: false });
    }

    const track = {
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a) => a.name).join(", "),
      album: data.item.album.name,
      albumArt: data.item.album.images[0]?.url ?? null,
      duration: data.item.duration_ms,
      progress: data.progress_ms,
      trackUrl: data.item.external_urls.spotify,
    };

    return res.status(200).json(track);
  } catch (err) {
    console.error("[spotify]", err);
    return res.status(500).json({ error: err.message });
  }
}
