import React, { useState, useEffect } from "react";
import styles from "./ItemListShow.module.css";
import poster from "../../assets/cover.jpg";
import { Link } from "react-router-dom";

function ItemListShow() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/show")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <img className={styles.poster} src={poster}></img>
          <ul>
            <li key={`title-${item.id}`}>
              <span>Title: </span>
              <span>{item.name}</span>
            </li>
            <li key={`genre-${item.id}`}>
              <span>Genre: </span>
              <span>{item.genre}</span>
            </li>
            <li key={`release-${item.id}`}>
              <span>Release Date: </span>
              <span>{item.releaseDate}</span>
            </li>
            <li key={`episodes-${item.id}`}>
              <span>Episodes: </span>
              <span>{item.episodes}</span>
              <span> minutes</span>
            </li>
          </ul>
          <div className={styles.buttons}>
            <h2>Add to list as: </h2>
            <Link to="/myMovies">
              <p className={styles.button}>Watched</p>
            </Link>
            <Link to="/myShows">
              <p className={styles.button}>Plan to watch</p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItemListShow;
