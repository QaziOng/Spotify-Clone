import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosHttp from '../../interceptors/axios-interceptor';
import { usePlayer } from '../../contexts/player-context';
import './album.scss';

export default function Album() {
    const [album, setAlbum] = useState({
        artists: [],
        images: [],
        tracks: {
            items: []
        }
    });
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
                const response = await axiosHttp.get(`/albums/${id}`);
                setAlbum(response.data);
            } catch (err) {
                console.error('Error fetching playlist details:', err.response?.data || err.message);
            }
        };

        fetchPlaylistDetails();
    }, [id]);

    useEffect(() => {
        if (playerState.currentTrackUri && album.tracks?.items?.length > 0) {
            const index = album.tracks.items.findIndex(
                item => item.uri === playerState.currentTrackUri
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
    }, [playerState.currentTrackUri, album.tracks])

    return (
        <div className="playlist-page" style={{ paddingInline: '2rem' }}>
            <div className='playlist-header'>
                <div className='playlist-image'>
                    <img src={album.images?.[0]?.url} alt={album.name} className='img-fluid h-100' />
                </div>
                <div className='playlist-info'>
                    <p><strong>Album</strong></p>
                    <h1>{album.name}</h1>
                    <p><strong>{album?.artists[0]?.name}</strong> - {album.tracks?.total} tracks</p>
                </div>
            </div>
            <div className='playlist-actions mt-4'>
                {playerState.isPaused || !album.tracks?.items.map(x => x.uri).includes(playerState.currentTrackUri) ? <i class="fa-solid fa-circle-play" onClick={() => playTrack(album.uri, [], currentTrackIndex, playerState.position)}></i> : <i class="fa-solid fa-circle-pause" onClick={() => pausePlayback()}></i>}
            </div>
            <div className='playlist-tracks mt-4'>
                <table className="table">
                    <thead>
                        <tr>
                            <th className='text-center' scope="col">#</th>
                            <th scope="col" style={{width: '90%'}}>Title</th>
                            <th className='text-center' scope="col"><i className="fa-regular fa-clock"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {album.tracks?.items?.map((item, index) => (
                            <tr key={index} onClick={() => playTrack(album.uri, [], index, 0)} className={playerState.currentTrackUri == item.uri ? 'active' : ''}>
                                <td className='text-center'>
                                    {playerState.currentTrackUri == item.uri ? (
                                        <img src='https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif' alt='Playing' className='img-fluid h-100' style={{ width: '15px' }} />
                                    ) : (
                                        index + 1
                                    )}
                                </td>
                                <td>
                                    <div className='d-flex align-items-center flex-wrap' style={{width: '90%'}}>
                                        <div className='track-title w-100'>{item.name}</div>
                                        <div className='track-artist' style={{opacity: '0.5'}}>{item.artists[0]?.name}</div>
                                    </div>
                                </td>
                                <td className='text-center'>{Math.floor(item.duration_ms / 60000)}:{Math.floor((item.duration_ms % 60000) / 1000).toString().padStart(2, '0')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}