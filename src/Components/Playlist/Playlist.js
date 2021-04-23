import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList';

export class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(e) {
        let name = e.target.value;
        this.props.changeN(name);
    }

    render() {
        return (
            <div className="Playlist">
                <input value={this.props.playlistName} onChange={this.handleNameChange} ></input>
                <p>ID: {this.props.selectedPlaylist}</p>
                <TrackList tracks={this.props.playlistTracks} 
                              onM={this.props.onM}
                        isRemoval={true} />
                <button className="Playlist-save" onClick={this.props.clear}>Clear</button>
            </div>
        );
    }
}