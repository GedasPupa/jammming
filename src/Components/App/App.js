import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import {Playlists} from '../Playlists/Playlists';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      // [
      //   {name: 'lialia', artist: 'tom', album: 'param', id: 1, uri: 444},
      //   {name: 'tratata', artist: 'jon', album: 'tatam', id: 2, uri: 666},
      //   {name: 'tototoo', artist: 'paul', album: 'dundum', id: 3, uri: 555}  
      // ],
      playlistName: 'New playlist',
      playlistTracks: [],
      // [
      //   {name: 'lll', artist: 'tom1', album: 'param1', id: 4, uri: 111},
      //   {name: 'jjj', artist: 'jon1', album: 'taram1', id: 5, uri: 222},
      //   {name: 'ppp', artist: 'paul1', album: 'dundun1', id: 6, uri: 333}
      // ],
      // savedURIs: null,
      playlists: [
          {name: 'playlist 1', id: 1},
          {name: 'playlist 2', id: 2}
      ],
      selectedPlaylist: null,
    };
    this.addTrack = this.addTrack.bind(this);
    this.minusTrack = this.minusTrack.bind(this);
    this.changeName = this.changeName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.unfollow = this.unfollow.bind(this);
    this.clear = this.clear.bind(this);
    this.modify = this.modify.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  minusTrack(track) {
    let tracks1 = this.state.playlistTracks;
    let filtered = tracks1.filter(mtrack => mtrack.id !== track.id);
    this.setState({playlistTracks: filtered});
  }

  changeName(newName) {
    this.setState({playlistName: newName});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    if (this.state.playlistName === '' || !trackURIs.length) {
      alert('Please enter playlist name and select tracks... ;)');
      return;
    };
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
        selectedPlaylist: ''
      });
    });
  }

  search(term) {
    if (term === '') {
      alert('Please enter search term... ;)');
      return;
    }
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
  }
  getUserPlaylists() {
    Spotify.getUserPlaylists().then(pl => {
      this.setState({ playlists: pl })
    })
  }
  getPlaylist(playlistID, name) {
    Spotify.getPlaylist(playlistID).then(pltracks => {
      this.setState({ 
        playlistName: name,
        playlistTracks: pltracks,
        selectedPlaylist: playlistID,
      })
    })
  }
  unfollow() {
    const plID = this.state.selectedPlaylist;
    Spotify.unfollow(plID).then(() => {
      this.setState({
        playlistName: 'New playlist',
        playlistTracks: [],
        selectedPlaylist: '',
      });
    })
  }
  clear() {
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: [],
      selectedPlaylist: '',
    });
  }
  modify(){
    const name = this.state.playlistName;
    const playlistID = this.state.selectedPlaylist;
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.modifyPlaylist(name, playlistID, trackURIs).then(() => {
      alert(`Playlist name changed to ${name}`)
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            {}
            <SearchBar onSearch={this.search} 
               getUserPlaylists={this.getUserPlaylists}
                   savePlaylist={this.savePlaylist}
                       unfollow={this.unfollow}
                         modify={this.modify} />
            <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
                                   onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
                    playlistTracks={this.state.playlistTracks}
                  selectedPlaylist={this.state.selectedPlaylist}
                               onM={this.minusTrack}
                           changeN={this.changeName}
                             clear={this.clear} />
            <Playlists playlists={this.state.playlists}
                getUserPlaylists={this.getUserPlaylists}
                     getPlaylist={this.getPlaylist} />
            </div>
          </div>
      </div>
    );
  }
  componentDidMount() {
    Spotify.getUserPlaylists();
  }
}

export default App;
