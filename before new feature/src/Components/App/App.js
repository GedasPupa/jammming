import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

// import logo from '../../logo.svg';
import './App.css';

// function App() {
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
    };
    this.addTrack = this.addTrack.bind(this);
    this.minusTrack = this.minusTrack.bind(this);
    this.changeName = this.changeName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
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
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search}/>
            <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
                    playlistTracks={this.state.playlistTracks}
                               onM={this.minusTrack}
                           changeN={this.changeName}
                           onSave={this.savePlaylist} />
            </div>
          </div>
      </div>
    );
  }
}

export default App;
