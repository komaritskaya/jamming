import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(evt) {
    this.setState({
      term: evt.target.value
    });
  }

  handleKeyUp(evt) {
    if (evt.keyCode === 13) {
      this.search();
    } else {
      return;
    }
  }

  render() {
    return (
      <div className="SearchBar">

        <input
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
          onKeyUp={this.handleKeyUp}
        />

        <a onClick={this.search}>SEARCH</a>

      </div>
    );
  }
}

export default SearchBar;
