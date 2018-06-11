// ./src/components/Playlist/Playlist.js

import React from 'react';

import './Playlist.css';

import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
	
	constructor(props) {
		super(props);

		this.handleNameChange = this.handleNameChange.bind(this);
	}

	//Update the Playlist name to whatever the user typed
	//accept an event that is triggered by an onChange attribute 
	//in the Playlist component's <input> element.
	handleNameChange(event) {
		this.props.onNameChange(event.target.value);
	}

	//pass .handleNameChange() to an onChange property.
	render() {
		return (
			<div className="playList">
			
				<input 
					defaultValue={this.props.playlistName}
					onChange={this.handleNameChange} 
					placeholder={'Type a new playlist name'} />
			
				<TrackList tracks={this.props.playlistTracks}
					   isRemoval={true}
					   onRemove={this.props.onRemove} />
					   
				<a className="playList-save" 
					onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
					
			</div>
		);
	}
}

export default Playlist;


