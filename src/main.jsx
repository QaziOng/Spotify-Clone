import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import './index.css'
import Login from './pages/login/login.jsx'
import Callback from './pages/call-back/callback.jsx'
import Home from './pages/home/home.jsx'
import Layout from './layout/layout.jsx'
import FeaturedPlaylists from './pages/featured-playlists/featured-playlists.jsx'
import Playlist from './pages/playlist/playlist.jsx'
import Album from './pages/album/album.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'callback',
        element: <Callback />,
      },
      {
        path: 'home',
        element: <Home />,
        children: [
          {
            path: '/home',
            element: <FeaturedPlaylists />,
          },
          {
            path: '/home/playlist',
            element: <Playlist />,
          }
          ,
          {
            path: '/home/album',
            element: <Album />,
          }
        ]
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
