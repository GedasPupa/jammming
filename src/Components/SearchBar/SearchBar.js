import React from 'react';
import './SearchBar.css';


export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {term: ''};
        this.search = this.search.bind(this);
        this.searchHandle = this.searchHandle.bind(this);
        
    }

    search() {
        this.props.onSearch(this.state.term);
    }
 
    searchHandle(event) {
        this.setState({term: event.target.value});
    }

    render() {
        return (
            <div className="SearchBar">
                <input onChange={this.searchHandle} placeholder="Enter A Song, Album, or Artist" />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
                <div className="buttons">
                    <button className="SearchButton s" onClick={this.props.savePlaylist}>SAVE TO SPOTIFY</button>
                    <button className="SearchButton s" onClick={this.props.modify}>MODIFY PLAYLIST</button>
                    <button className="SearchButton s" onClick={this.props.getUserPlaylists}>GET PLAYLISTS</button>
                </div>
                <button className="SearchButton" onClick={this.props.unfollow}>UNFOLLOW</button>
            </div>
        );
    }
}