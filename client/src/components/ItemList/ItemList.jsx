import React, { useState, useEffect } from "react";
import styles from "./ItemList.module.css";
import poster from "../../assets/cover.jpg";
import { Link } from "react-router-dom";

function ItemList({ searchTerm }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/movie")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, []);

  const addToWatchedList = (id) => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    const requestData = {
      user: {
        user_id: userId,
      },
    };

    fetch(`http://localhost:8080/api/juncMovie/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          // Movie added successfully, navigate to "/myMovies" route
        } else {
          console.error("Failed to add movie as watched");
        }
      })
      .catch((error) => console.error(error));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filteredItems.map((item) => (
        <div key={item.movie_id} className={styles.item}>
          <img className={styles.poster} src={poster} alt="Movie Poster" />
          <ul>
            <li key={`title-${item.movie_id}`}>
              <span>Title: </span>
              <span>{item.name}</span>
            </li>
            <li key={`genre-${item.movie_id}`}>
              <span>Genre: </span>
              <span>{item.genre}</span>
            </li>
            <li key={`release-${item.movie_id}`}>
              <span>Release Date: </span>
              <span>{item.releaseDate}</span>
            </li>
            <li key={`duration-${item.movie_id}`}>
              <span>Duration: </span>
              <span>{item.duration}</span>
              <span> minutes</span>
            </li>
          </ul>
          <div className={styles.buttons}>
            <h2>Add to list as: </h2>
            <p
              className={styles.button}
              onClick={() => addToWatchedList(item.movie_id)}
            >
              Watched
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItemList;
