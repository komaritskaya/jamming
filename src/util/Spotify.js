let access_token = '';
let expires_in = '';
const CLIENT_ID = 'd09526da810d41e5bf74d86cdf4f6966';
const REDIRECT_URI = 'https://jamming-by-nadezhda.surge.sh';
const Spotify = {
  getAccessToken() {
    if(access_token) {
      return access_token;
    } else {
      const getToken = window.location.href.match(/access_token=([^&]*)/);
      const getExpirationTime = window.location.href.match(/expires_in=([^&]*)/);

      if (getToken && getExpirationTime) {
        access_token = getToken[1];
        let expires_in = Number(getExpirationTime[1]);
        window.setTimeout(() => access_token = '', expires_in * 1000);
        window.history.pushState('Access Token', null, '/');
        return access_token;
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
        return access_token;
      }
    }
  },

  search(term) {
    Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        });
      } else {
        return [];
      }
    });
  },

  savePlaylist(playlistName, trackURIs) {
    if(!playlistName && !trackURIs) {
      return;
    } else {
      Spotify.getAccessToken();
      const headers = {
        Authorization: `Bearer ${access_token}`
      };
      let userID = '';

      return fetch('https://api.spotify.com/v1/me', {
        headers: headers,
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        userID = jsonResponse.id;

        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({
            name: playlistName
          })
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          let playlistID = jsonResponse.id;

          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({
              uris: trackURIs
            })
          })
        });
      });
    }
  }
};



export default Spotify;
