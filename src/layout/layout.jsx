import { Link, Outlet } from "react-router-dom";
import { PlayerProvider } from "../contexts/player-context";
import './layout.scss';
export default function Layout() {
    return (
        <PlayerProvider>
            <div className="d-flex flex-column min-vh-100">
                <header>
                    <nav className="navbar navbar-expand-lg navbar-dark px-4" style={{ 'height': '5vh', minHeight: '4rem' }}>
                        <Link className="navbar-brand h-100 d-flex align-items-center gap-3" to="/"><img src="/src/assets/Spotify_logo_green.png" className="img-fluid h-100"/> Spotify Player</Link>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navContent">
                            <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
                                <li className="nav-item">
                                    <Link className="nav-link" to="home">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-white" to="login">Login</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>

                <main className="main-content" style={{ height: '95vh' }}>
                    <Outlet /> {/* This is where child routes render */}
                </main>
                {/* <footer className="text-light text-center py-3" style={{ marginTop: 'auto' }}>
                <div>© 2025 MyMusicApp — All rights reserved</div>
            </footer> */}
            </div>
        </PlayerProvider>
    );
}   