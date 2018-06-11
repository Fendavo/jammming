// ./src/components/SearchBar/SearchBar.js

import React from 'react';

import './SearchBar.css';

class SearchBar extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
		  term: ''
		};

		this.handleTermChange = this.handleTermChange.bind(this);
		this.search = this.search.bind(this);
	}

	//method called handleTermChange with the following functionality:
	//Accepts an event argument
	//Sets the state of the search bar's term to the event target's value.
	handleTermChange(event) {
		this.setState({term: event.target.value});
	}

	//create a method called search that passes the state of the 
	//term to this.props.onSearch
	search() {
		this.props.onSearch(this.state.term);
	}

	render() {
		return (
		  <div className="searchBar">
		  
			<input 
				placeholder="Enter a Song, Album, or Artist" 
				onChange={this.handleTermChange} />
				
			<a onClick={this.search}>SEARCH</a>
			
		  </div>
		);
	}
}

export default SearchBar;
