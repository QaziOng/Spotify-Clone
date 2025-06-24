// src/Login.js
const clientId = "d52a1c2f019e40d9ab9b36610b5333ef";
const redirectUri = "http://[::1]:5173/callback";
const scopes = [
    "ugc-image-upload",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "app-remote-control",
    "streaming",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-follow-modify",
    "user-follow-read",
    "user-read-playback-position",
    "user-top-read",
    "user-read-recently-played",
    "user-library-modify",
    "user-library-read",
    "user-read-email",
    "user-read-private",
    // "user-personalized",
];
import './login.scss';
export default function Login() {
    const AUTH_URL =
        `https://accounts.spotify.com/authorize` +
        `?client_id=${clientId}` +
        `&response_type=code` +  // <- Must be 'token' for frontend apps
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${scopes.join('%20')}`;

    return (
        <div className="d-flex align-items-center justify-content-center h-100">
            <a className="btn login-btn" href={AUTH_URL} >
                Login with Spotify
                <img src='/src/assets/Spotify_Logo-white.png' className='img-fluid h-100' />
            </a>
        </div>
    );
}