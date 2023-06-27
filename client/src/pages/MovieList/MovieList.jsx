import React, { useState } from "react";
import ItemList from "../../components/ItemList/ItemList";
import styles from "./MovieList.module.css";

function MovieList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <p>Filter by genre</p>
        <button
          className={`${styles.filterButton} ${
            selectedGenre === "Action" ? styles.active : ""
          }`}
          onClick={() => handleGenreFilter("Action")}
        >
          Action
        </button>
        <button
          className={`${styles.filterButton} ${
            selectedGenre === "Drama" ? styles.active : ""
          }`}
          onClick={() => handleGenreFilter("Drama")}
        >
          Drama
        </button>
        <button
          className={`${styles.filterButton} ${
            selectedGenre === "Comedy" ? styles.active : ""
          }`}
          onClick={() => handleGenreFilter("Comedy")}
        >
          Comedy
        </button>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.content}>
        <ItemList searchTerm={searchTerm} selectedGenre={selectedGenre} />
      </div>
    </div>
  );
}

export default MovieList;
