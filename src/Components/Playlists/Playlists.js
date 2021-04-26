import React from 'react';
import './Playlists.css';

export class Playlists extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePlaylist = this.handlePlaylist.bind(this);
    }

    handleNameChange(e) {
        let name = e.target.value;
        this.props.changeN(name);
    }

    handlePlaylist(event) {
        let name = event.target.id;
        let playlistID = event.currentTarget.id;
        this.props.getPlaylist(playlistID, name);
    }

    render() {
        return (
            <div className="Playlists">
                <h2>Your playlists</h2>
                {this.props.playlists.map(playlist => {
                    return (<div className='plTrack' key={playlist.id}>
                                <div className='plTrack-information'>
                                    <button className='Track-action' id={playlist.id} onClick={this.handlePlaylist}><h3  id={playlist.name}>{playlist.name}</h3></button>
                                    <p>ID: {playlist.id}</p>
                                </div>
                            </div>)
                    })
                }
                <button className="Playlist-save" onClick={this.props.getUserPlaylists}>Refresh</button>
            </div>
        );
    }
}