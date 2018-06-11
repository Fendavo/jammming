// ./src/components/App/App.js 

import React from 'react';
import './App.css';

import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../utils/Spotify';

class App extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			searchResults: [],
			playlistName: 'New Playlist',
			playlistTracks: []
		};

		this.search = this.search.bind(this);
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
	}

	//Pass the state of the App component's searchResults 
	//to the SearchResults component.
	//Accepts a search term
	//Logs the term to the console
	//In a later assessment, we will hook this method up to the Spotify API.
	search(term) {
		
		console.log(`The search term was ${term}`);
		
		Spotify.search(term).then(searchResults => {
			this.setState({searchResults: searchResults});
		});
		
	}

	/*The 'addTrack' method adds a song to the playlist state. 
	The application passes the method through a series of components to Track. 
	The user can trigger the .addTrack() method by clicking the + sign from 
	the search results list.*/
	addTrack(track) {
		let tracks = this.state.playlistTracks;
		tracks.push(track);

		this.setState({playlistTracks: tracks});
	}
	
	/*The 'removeTrack' method removes a song to the playlist state. 
	The application passes the method through a series of components to Track. 
	The user can trigger the .removeTrack() method by clicking the - sign from 
	the search results list.*/
	removeTrack(track) {
		let tracks = this.state.playlistTracks;
		tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

		this.setState({playlistTracks: tracks});
	}

	//allow a learner to change the name of their playlist, 
	//and save the updated value to the App component's state.
	updatePlaylistName(name) {
		this.setState({playlistName: name});
	}

	//https://developer.spotify.com/documentation/web-api/
	//save a user's playlist to their Spotify account and reset the 
	//state of the playlist name and tracks array.
	//access a track property named uri. Spotify uses this field to reference 
	//tracks in the Spotify library. Create an array containing the 
	//uri of each track in the playlistTracks property.
	savePlaylist() {
		//Generate an array of URI values - call it trackUris
		const trackUris = this.state.playlistTracks.map(track => track.uri);
		
		//Use the Spotify.savePlayList() method
		//#95 After you call Spotify.savePlaylist(), 
		//    reset the state of playlistName to 'New Playlist' and 
		//    playlistTracks to an empty array.
		Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
			this.setState({
				playlistName: 'New Playlist Name',
				playlistTracks: []
			});
		});
		
	}

	render() {
		return (
			<div>
				<div className="App-header">
					<h1>Ja <span className="highlight">m m m</span> ing</h1>
				</div>
				
				<div className="App">
				
				  <SearchBar onSearch={this.search} />
				  
					<div className="App-playlist">
						<SearchResults 
							searchResults={this.state.searchResults}
							onAdd={this.addTrack} />
								
						<Playlist playlistTracks={this.state.playlistTracks}
							onNameChange={this.updatePlaylistName}
							onRemove={this.removeTrack}
							onSave={this.savePlaylist} />
					</div>
				  
				</div>
			</div>
		);
	}
}

export default App;


