import React, { useState } from "react";
import ItemList from "../../components/ItemList/ItemList";
import styles from "./MovieList.module.css";

function MovieList() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={styles.container}>
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
        <ItemList searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default MovieList;
