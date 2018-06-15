// ./src/components/Track/Track.js

import React from 'react';

import './Track.css';

class Track extends React.Component {
	
	constructor(props) {
		super(props);
		
        this.state = {
            currentlyPlaying: false,
        };
		
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
	}

	//add this.props.track from a user's custom playlist when the 
	//user selects the + sign inside of a rendered track.
	addTrack(event) {
		this.props.onAdd(this.props.track);
	}

	//remove this.props.track from a user's custom playlist when the 
	//user selects the - sign inside of a rendered track.
	removeTrack(event) {
		this.props.onRemove(this.props.track);
	}

	//displays a linked +/- to add/remove tracks from playlist
	renderAction() {
		if (this.props.isRemoval) {
		  return <a className="track-action" 
					onClick={this.removeTrack}>-</a>
		}
		
		return <a 	className="track-action" 
					onClick={this.addTrack}>+</a>;
	}

	render() {
			return (
				<div className="track" key={this.props.track.id}>
				    <div className="track-cover-art">
						if (this.props.track.coverArt === null || this.props.track.coverArt === "") {
							<img src="./no-image.png" height="48" width="48" alt="Album cover art" />
						}
						else
							<img src={this.props.track.coverArt} height="48" width="48" alt="Album cover art" />
					</div>
				
					<div className="track-information">
					  <h3>{this.props.track.name}</h3>
					  <p>{this.props.track.artist} | {this.props.track.album}</p>
					</div>
					
					{this.renderAction()}
				</div>
			);
  }
}

export default Track;


