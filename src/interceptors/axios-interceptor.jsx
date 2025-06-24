import axios from "axios";
const axiosHttp = axios.create({
  baseURL: `https://api.spotify.com/v1`,
});

axiosHttp.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.spotify_access_token; 

    if (accessToken) { 
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => { // Error-handling
    console.error("Request error ::", error);
    return Promise.reject(error);
  }
);

axiosHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.error("Response error :: ", error.response);
      
      localStorage.removeItem("spotify_access_token");

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosHttp;