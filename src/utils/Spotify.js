//Create and collect ClientId here:
//https://developer.spotify.com/dashboard/applications/77922840042e493b9b5b6d9b1495ddfd
const clientId = '77922840042e493b9b5b6d9b1495ddfd';

//Add the URI here:
//https://developer.spotify.com/dashboard/applications/77922840042e493b9b5b6d9b1495ddfd
//const redirectUri = 'http://localhost:3000/';
const redirectUri = 'http://fendavo.surge.sh/';

//used in window.location below
const spotifyUrl = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`;

//empty variable that will hold the user's access token.
let accessToken = undefined;

let expiresIn = undefined;

//Spotify object
const Spotify = {
	
	// Get access token from Spotify
	getAccessToken() {
		
		//Check if the user's access token is already set. 
		//If it is, return the value saved to access token.
		if (accessToken) {
		  return accessToken;
		}
		
		//https://developer.spotify.com/documentation/general/guides/authorization-guide/
		//If the access token is not already set, check the URL to see if it has just been obtained.
		//You will be using the Implicit Grant Flow to setup a user's account and make requests. The implicit grant flow returns a user's access token in the URL.
		//Use the guide to determine how to parse the URL and set values for your access token and expiration time.
		//Look at the hint if you help parsing the URL.
		const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
		const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
		
		/*If the access token and expiration time are in the URL, implement the following:
			Set the access token value
			Set a variable for expiration time
			Set the access token to expire at the value for expiration time
			Clear the parameters from the URL, so the app doesn't 
			   try grabbing the access token after it has expired*/
		if (urlAccessToken && urlExpiresIn) {
			accessToken = urlAccessToken[1];
			expiresIn = urlExpiresIn[1];
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {		
			window.location = spotifyUrl;
		}
	},

	// Use the access token to return a response from Spotify API using 
	// user search words from SearchBar component
	search(term) {
		accessToken = Spotify.getAccessToken();
		
		//You should use the /v1/search?type=TRACK endpoint when making your request. 
		//https://developer.spotify.com/documentation/web-api/reference/
		const theUrl = `https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`;
		
		return fetch(theUrl, {
			headers: {
			  Authorization: `Bearer ${accessToken}`
			}
		  }).then(response => { 
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('API request failed');
					//console.log(response.json());
				}
			}
		  ).then(jsonResponse => {
			  
			if (!jsonResponse.tracks) return [];
			
			return jsonResponse.tracks.items.map(track => 
			{
			  return {
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				album: track.album.name,
				uri: track.uri//,
				//cover: track.album.images[2].url
			  }
			})
			
		  });
	},

	// Get userID from Spotify, create new playlist on user's account, 
	// add tracks to user's playlist
	//method accepts two arguments. 
	//The first argument is the name of the playlist. 
	//The second is an array of track URIs.

	savePlaylist(name, trackUris) {
		//check if there are values saved to the two 
		//arguments. If not, return.		
		if (!name || !trackUris || trackUris.length === 0) return;
		
		//user URL
		const userUrl = 'https://api.spotify.com/v1/me';
		
		/*Create three default variables:
			An access token variable, set to the current user's access token
			A headers variable, set to an object with an Authorization parameter containing the user's access token in the implicit grant flow request format
			An empty variable for the user's ID
		*/
		let userId = undefined;
		let playlistId = undefined;
		
		const headers = {
		  Authorization: `Bearer ${accessToken}`
		};
		
		/*
		#93 Use the returned user ID to make a POST request that creates a new playlist in the 
		   user's account and returns a playlist ID.
		Use the Spotify playlist endpoints (//https://developer.spotify.com/documentation/web-api/reference/playlists/) 
		   to find a request that creates a new playlist.
		Set the playlist name to the value passed into the method.
		Convert the response to JSON and save the response id parameter to a 
		   variable called playlistID.
		   
		#94 Use the returned user ID to make a POST request that creates a 
		       new playlist in the user's account and returns a playlist ID.
			Use the Spotify playlist endpoints to find a request that adds tracks 
			   to a playlist.
			Set the URIs parameter to an array of track URIs passed into the method.
			Convert the response to JSON and save the response id parameter to a 
			   variable called playlistID.
		*/
		fetch(userUrl, {headers: headers})
		.then(response => response.json())
		.then(jsonResponse => userId = jsonResponse.id)
		.then(() => {
			const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
			fetch(createPlaylistUrl, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					name: name
				})
			})
			.then(response => response.json())
			.then(jsonResponse => playlistId = jsonResponse.id)
			.then(() => {
				const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
				fetch(addPlaylistTracksUrl, {
					method: 'POST',
					headers: headers,
					body: JSON.stringify({
						uris: trackUris
					})
			  });
			})
		})
  }
};

export default Spotify;