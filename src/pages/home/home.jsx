import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axiosHttp from '../../interceptors/axios-interceptor';
import './home.scss';
import { Link } from 'react-router-dom';
import Player from '../player/player';

export default function Home() {
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axiosHttp.get('/me/albums');
                setAlbums(response.data.items);
            } catch (err) {
                console.error('Error fetching albums:', err.response?.data || err.message);
            }
        };
        const fetchPlaylists = async () => {
            try {
                const response = await axiosHttp.get('/me/playlists ');
                setPlaylists(response.data.items);
            } catch (err) {
                console.error('Error fetching albums:', err.response?.data || err.message);
            }
        };

        fetchAlbums();
        fetchPlaylists();
    }, []);

    return (
        <>
            <div className='d-flex'>
                <div className='w-25' style={{ height: '95vh', overflowY: 'auto' }}>
                    <div className='d-flex justify-content-between align-items-center px-4 py-3'>
                        <h4 className='mb-0'>Your Library</h4>
                    </div>
                    {albums.map((item, index) => (
                        <Link key={index} to={'/home/album?id=' + item.album.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            <div className='library-item py-1'>
                                <div className='album-image'>
                                    <img src={item.album.images[0]?.url} alt={item.album.name} className='img-fluid h-100' />
                                </div>
                                <div className='album-info'>
                                    <h3 className='text-overflow-ellipsis'>{item.album.name}</h3>
                                    <p className='fw-bold' style={{opacity: '0.5'}}> Album: {item.album.artists.map((a) => a.name).join(', ')} - {item.album.tracks.total} tracks</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {playlists.map((item, index) => (
                        <Link key={index} to={'/home/playlist?id=' + item.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            <div className='library-item py-1' >
                                <div className='album-image'>
                                    <img src={item.images[0]?.url} alt={item.name} className='img-fluid h-100' />
                                </div>
                                <div className='album-info'>
                                    <h3 className='text-overflow-ellipsis'>{item.name}</h3>
                                    <p className='fw-bold' style={{opacity: '0.5'}}> Playlist: {item.owner.display_name} - {item.tracks.total} tracks</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div style={{marginBottom: '20vh'}}></div>
                </div>
                <div className='w-75' style={{ height: '95vh', overflowY: 'auto' }}>
                    <Outlet />
                    <div style={{marginBottom: '20vh'}}></div>
                </div>
            </div>
            <div className='player-container'>
                <Player />
            </div>
        </>
    );
}