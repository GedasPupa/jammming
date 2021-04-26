
let accessToken;
let userID;
const clientID = "88c727a90d314b2d927077efa7d932db";
const redirectURI = "https://jammming-modify-playlists.netlify.app";

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        // check for accessToken match
        const accesssTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accesssTokenMatch && expiresInMatch) {
            accessToken = accesssTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // This clears parameters, allowing us to grab new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));            
        });
    },

    savePlaylist(name, trackURIs) {
        Spotify.getCurrentUserId();
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: name})
        }).then(response => response.json()
        ).then(jsonResponse => {
            const playlistID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackURIs })
            });
        })
    },

    getCurrentUserId() {
        if (userID) {
            return userID;
        } else {
            const accessToken = Spotify.getAccessToken();
            const headers = {
                Authorization: `Bearer ${accessToken}`
            }
            return fetch(`https://api.spotify.com/v1/me`, {headers: headers}
            ).then(response => 
                response.json()
            ).then(jsonResponse => {
                userID = jsonResponse.id;
            });
        }
    },

    getUserPlaylists() {
        Spotify.getCurrentUserId();
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers
        }).then(response => response.json()
        ).then(jsonResponse => {
            if (jsonResponse.total === 0) {
                return [];
            }
            return jsonResponse.items.map(pl => ({
                id: pl.id,
                name: pl.name,
            }))
        })
    },

    getPlaylist(playlistID) {
        Spotify.getCurrentUserId();
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            headers: headers
        }).then(response => response.json()
        ).then(jsonResponse => {
            if (!jsonResponse.items) {
                return [];
            }
            // console.log(jsonResponse);
            return jsonResponse.items.map(item => ({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                uri: item.track.uri
            }))
        })
    },

    unfollow(playlistID) {
        Spotify.getCurrentUserId();
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/followers`, {
            headers: headers,
            method: 'DELETE',
        }).then(() => {
            return alert(`Playlist ID: ${playlistID} unfollowed successfully!`);
        });
    },

    modifyPlaylist(name, playlistID, trackURIs) {
        Spotify.getCurrentUserId();
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        return fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify({ name: name })
        }).then(() => {
            return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
            {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({ uris: trackURIs })
            }
        )})
    }
};

export default Spotify;