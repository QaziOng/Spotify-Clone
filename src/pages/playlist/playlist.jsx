import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosHttp from '../../interceptors/axios-interceptor';
import { usePlayer } from '../../contexts/player-context';
import './playlist.scss';

export default function Playlist() {
    const [playlist, setPlaylist] = useState([]);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const { playerState, setPlayerState } = usePlayer({
        currentTrackUri: null,
        isPaused: true,
        position: 0,
        duration: 0,
    });
    const [currentTrackIndex, setTrackIndex] = useState(0);

    const playTrack = async (playListUri, trackUri, index, position) => {
        try {
            await axiosHttp.put(`/me/player/play`, {
                "context_uri": trackUri.length > 0 ? null : playListUri,
                // "uris": trackUri,
                "offset": {
                    "position": trackUri.length > 0 ? 0 : index
                },
                "position_ms": position
            });
        } catch (err) {
            console.error('Error fetching playlist details:', err.response?.data || err.message);
        }
    };

    const pausePlayback = async () => {
        await axiosHttp.put(`/me/player/pause`);
    };

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                const response = await axiosHttp.get(`/playlists/${id}`);
                setPlaylist(response.data);
            } catch (err) {
                console.error('Error fetching playlist details:', err.response?.data || err.message);
            }
        };

        fetchPlaylistDetails();
    }, [id]);

    useEffect(() => {
        if (playerState.currentTrackUri && playlist.tracks?.items?.length > 0) {
            const index = playlist.tracks.items.findIndex(
                item => item.track.uri === playerState.currentTrackUri
            );
            if (index !== -1) {
                setTrackIndex(index);
            } else {
                setTrackIndex(0);
                // Reset position if track is not in this playlist
                setPlayerState(prev => ({
                    ...prev,
                    position: 0,
                    duration: 0
                }));
            }
        }
    }, [playerState.currentTrackUri, playlist.tracks])

    return (
        <div className="playlist-page" style={{ paddingInline: '2rem' }}>
            <div className='playlist-header'>
                <div className='playlist-image'>
                    <img src={playlist.images?.[0]?.url} alt={playlist.name} className='img-fluid h-100' />
                </div>
                <div className='playlist-info'>
                    <p><strong>{playlist.public ? 'Public' : 'Private'} Playlist</strong></p>
                    <h1>{playlist.name}</h1>
                    <p><strong>{playlist.owner?.display_name}</strong> - {playlist.tracks?.total} tracks</p>
                </div>
            </div>
            <div className='playlist-actions mt-4'>
                {playerState.isPaused || !playlist.tracks?.items.map(x => x.track.uri).includes(playerState.currentTrackUri) ? <i class="fa-solid fa-circle-play" onClick={() => playTrack(playlist.uri, [], currentTrackIndex, playerState.position)}></i> : <i class="fa-solid fa-circle-pause" onClick={() => pausePlayback()}></i>}
            </div>
            <div className='playlist-tracks mt-4'>
                <table className="table">
                    <thead>
                        <tr>
                            <th className='text-center' scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Album</th>
                            <th scope="col">Date added</th>
                            <th className='text-center' scope="col"><i className="fa-regular fa-clock"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {playlist.tracks?.items?.map((item, index) => (
                            <tr key={index} onClick={() => playTrack(playlist.uri, [], index, 0)} className={playerState.currentTrackUri == item.track.uri ? 'active' : ''}>
                                <td className='text-center'>
                                    {playerState.currentTrackUri == item.track.uri ? (
                                        <img src='https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif' alt='Playing' className='img-fluid h-100' style={{ width: '15px' }} />
                                    ) : (
                                        index + 1
                                    )}
                                </td>
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <img src={item.track.album.images[0]?.url} alt={item.track.name} className='img-fluid' style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                        <div className='d-flex align-items-center flex-wrap'>
                                        <span className='track-title w-100'>{item.track.name}</span>
                                        <div className='track-artist' style={{opacity: '0.5'}}>{item.track.artists[0]?.name}</div>
                                        </div>
                                        
                                    </div>
                                </td>
                                <td>{item.track.album.name}</td>
                                <td>{new Date(item.added_at).toLocaleDateString()}</td>
                                <td className='text-center'>{Math.floor(item.track.duration_ms / 60000)}:{Math.floor((item.track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}