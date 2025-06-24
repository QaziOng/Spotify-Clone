import { useEffect, useState } from "react";
import axiosHttp from "../../interceptors/axios-interceptor";
import "./player.scss";
import "https://unpkg.com/range-slider-element@2/dist/range-slider-element.js";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { usePlayer } from "../../contexts/player-context";  

export default function Player() {
    const [currentTrack, setCurrent] = useState({
        artists: [],
        album: {
            images: []
        },
    });
    const [player, setPlayer] = useState(undefined);
    const [device_id, setDeviceId] = useState(null);
    const [is_paused, setPaused] = useState(false);
    const [state, setState] = useState({
        position: 0,
        duration: 0,
    });
    const [volume, setVolume] = useState(100);
    const { setPlayerState } = usePlayer({
        currentTrackUri: null,
        isPaused: true,
        position: 0,
        duration: 0,
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => cb(localStorage.getItem('spotify_access_token')),
                volume: 1,
            });

            player.addListener('initialization_error', ({ message }) => {
                console.error('Initialization Error:', message);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error('Authentication Error:', message);
            });

            player.addListener('account_error', ({ message }) => {
                console.error('Account Error:', message);
            });

            player.addListener('player_state_changed', (state) => {
                console.log('Player State Changed:', state);
                if (!state) return;

                setCurrent(state.track_window.current_track);
                setPaused(state.paused);
                setState(state);

                player.getVolume().then(volume => {
                    setVolume(volume * 100);
                });

                setPlayerState({
                    currentTrackUri: state.track_window.current_track.uri,
                    isPaused: state.paused,
                    position: state.position,
                    duration: state.duration,
                });
            });

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
                axiosHttp.put("me/player", {
                    device_ids: [device_id],
                    play: false,
                });
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.connect();

            setPlayer(player);
        };
    }, []);


    // useEffect(() => {
    //     const fetchPlaylistDetails = async () => {
    //         try {
    //             const response = await axiosHttp.get(`/me/player/currently-playing`);
    //             setCurrent(response.data);
    //             console.log('Current Track:', response.data.item);
    //         } catch (err) {
    //             console.error('Error fetching playlist details:', err.response?.data || err.message);
    //         }
    //     };


    //     fetchPlaylistDetails();
    // }, []);

    useEffect(() => {
        let interval = null;

        if (!is_paused) {
            interval = setInterval(() => {
                state.duration && setState(prev => ({
                    ...prev,
                    position: Math.min(prev.position + 1000, state.duration)
                }));
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [is_paused, state]);

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    const seek = async (e) => {
        console.log('Seeking to:', e);
        player.seek(e);
        // await axiosHttp.put(`/me/player/seek?position_ms=${e}&device_id=${device_id}`);
    };

    function onSeekChange(e) {
        setState(prev => ({
            ...prev,
            position: e
        }));
        player.seek(e);
    }

    function onVolumeChange(e) {
        setVolume(e);
        player.setVolume(e / 100);
    }

    const toggleShuffle = async () => {
        await axiosHttp.put(`/me/player/shuffle?state=${!state.shuffle}&device_id=${device_id}`);
    }

    const toggleRepeat = async () => {
        var context = state.repeat_mode === 0 ? 'context' : state.repeat_mode === 1 ? 'track' : 'off';
        await axiosHttp.put(`/me/player/repeat?state=${context}&device_id=${device_id}`);
    }

    return (
        <div className="player">
            <div className="player-image">
                <img src={currentTrack?.album?.images[0]?.url} alt={currentTrack?.name} className="img-fluid" />
            </div>
            <div className="player-info">
                <h5 className="text-overflow-ellipsis">{currentTrack?.name}</h5>
                <p style={{opacity: '0.5'}}>{currentTrack?.artists[0]?.name}</p>
            </div>
            <div className="player-controls">
                <div className="controls">
                    <div onClick={() =>  toggleShuffle() } className={ state.shuffle ? 'color-green' : ''} >
                        <i class="fa-solid fa-shuffle"></i>
                    </div>
                    <div onClick={() => { player.previousTrack() }} >
                        <i class="fa-solid fa-backward-step"></i>
                    </div>
                    <div className="play-btn" onClick={() => { player.togglePlay() }} >
                        {is_paused ? <i class="fa-solid fa-circle-play"></i> : <i class="fa-solid fa-circle-pause"></i>}
                    </div>
                    <div onClick={() => { player.nextTrack() }} >
                        <i class="fa-solid fa-forward-step"></i>
                    </div>
                    <div onClick={() => toggleRepeat() } className={ state.repeat_mode > 0 ? 'color-green' : ''} style={{ position: 'relative' }}>
                        <i class="fa-solid fa-repeat"></i>
                        {state.repeat_mode === 2 && <span className="one-label">1</span>}
                    </div>
                </div>
                <div className="slider-container">
                    <span className="time">{formatTime(state.position)}</span>
                    <Slider
                        min={0}
                        max={state.duration}
                        value={state.position}
                        onChange={(e) => onSeekChange(e)}
                        onChangeComplete={(e) => seek(e)}
                    />
                    <span className="time">{formatTime(state.duration)}</span>
                </div>
            </div>
            <div className="player-volume me-2">
                <div>
                    <i className={`fa-solid ${volume === 0 ? 'fa-volume-xmark' : volume <= 50 ? 'fa-volume-low' : 'fa-volume-high'}`}></i>
                </div>
                <Slider
                    className="w-25"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => onVolumeChange(e)}
                    // onChangeComplete={(e) => playbackVolume(e)}
                />
            </div>
        </div>
    );
}