
let accessToken;
const clientID = "938ac28574f7468fabbb353a84070f3e";
const redirectURI = "http://create-new-playlist.surge.sh";

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
            return response.json();
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
        if (!name || !trackURIs.length) {
            return;
        };
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userID;
        
        return fetch(`https://api.spotify.com/v1/me`, {headers: headers}
        ).then(response => 
            response.json()
        ).then(jsonResponse => {
            const userID = jsonResponse.id;
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
        })
    }
};




export default Spotify;