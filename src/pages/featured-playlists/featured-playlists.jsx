import React, { useEffect, useState } from 'react';
import axiosHttp from '../../interceptors/axios-interceptor';
import './featured-playlists.scss';
import { Link } from 'react-router-dom';

export default function FeaturedPlaylists() {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchNewReleases = async () => {
            const response = await axiosHttp.get('/browse/new-releases?limit=50');
            setAlbums(response.data.albums.items);
        };

        fetchNewReleases();
    }, []);

    return (
        <div className=' p-4'>
            <h1>New Realeases</h1>
            <div className="albums-list">
                {albums?.map((item, index) => (
                    <Link key={index} to={'/home/album?id=' + item.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} className="album-item">
                        <img src={item.images[0]?.url} alt={item.name} className="img-fluid" />
                        <div className='w-100'>
                            <h3>{item.name}</h3>
                            <p className="text-overflow-ellipsis">{item.artists.map(artist => artist.name).join(', ')}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
