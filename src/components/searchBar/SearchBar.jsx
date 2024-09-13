import React, { useState } from "react";
import "./SearchBar.css";


function SearchBar({ placeholder, data, onSearch }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Your code here
  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder || "Search..."}
        className="search-input"
      />
      {/* <button className="search-button" onClick={handleSearch}>
        Search
      </button> */}
    </div>
  );
}

export default SearchBar;
