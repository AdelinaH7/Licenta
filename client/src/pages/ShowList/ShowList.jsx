import React, { useState } from "react";
import ItemListShow from "../../components/ItemListShow/ItemListShow";
import styles from "./ShowList.module.css";

function ShowList() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search shows..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.content}>
        <ItemListShow searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default ShowList;
