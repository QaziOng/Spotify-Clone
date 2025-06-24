import axios from 'axios';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const fetchToken = async () => {
      const clientId = 'd52a1c2f019e40d9ab9b36610b5333ef';
      const clientSecret = '536cdb00fda44ae7834718252c32691e';
      const basicAuth = btoa(`${clientId}:${clientSecret}`);

      const params = new URLSearchParams();
      params.append('code', code);
      params.append('redirect_uri', 'http://[::1]:5173/callback');
      params.append('grant_type', 'authorization_code');

      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          params,
          {
            headers: {
              Authorization: `Basic ${basicAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        console.log('Access Token:', response.data.access_token);
        localStorage.setItem('spotify_access_token', response.data.access_token);

        navigate('/home')
      } catch (error) {
        console.error('Error fetching token:', error.response?.data || error.message);
      }
    };

    fetchToken();
  }, [code, navigate]);

  return (
    <>
      <div>Hello Callback</div>
    </>
  );
}