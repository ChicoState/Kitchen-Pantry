// Import React and useState from 'react'
import React, { useState } from 'react';
import { Searchbar } from 'react-native-paper';

const SearchComponent = ({ setSearchQuery, handleSearch }) => {
  const [searchQuery, setSearchQueryLocal] = useState('');

  const onChangeSearch = (query) => {
    setSearchQueryLocal(query);
    setSearchQuery(query); // Pass the search query to the parent component
  };

  const onSubmit = () => {
    handleSearch();
  };

  return (
    <Searchbar
      placeholder="Search Meals"
      onChangeText={onChangeSearch}
      onSubmitEditing={onSubmit}
      value={searchQuery}
      style={{ width: '90%', marginTop: 20, marginBottom: 20 }}
    />
  );
};

export default SearchComponent;
