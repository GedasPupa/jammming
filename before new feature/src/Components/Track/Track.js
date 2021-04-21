import React from 'react';
import './Track.css';

export class Track extends React.Component {

    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.minusTrack = this.minusTrack.bind(this);
}

    renderAction() {
        if (this.props.isRemoval) {
            return <button className='Track-action' onClick={this.minusTrack}>-</button>
        } else {
            return <button className='Track-action' onClick={this.addTrack}>+</button>
        }
    }
    
    addTrack() {
        this.props.onAdd(this.props.track);
    }

    minusTrack() {
        this.props.onM(this.props.track);
    }

    render() {

        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {this.renderAction()}
            </div>
        );
    }
}