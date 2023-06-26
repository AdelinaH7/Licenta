import React, { useState, useEffect } from "react";
import styles from "./ItemList.module.css";
import { Buffer } from "buffer";

function ItemList({ searchTerm }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/movie`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }

        const data = await response.json();

        const updatedItems = data.map((movie) => {
          if (movie.picture && movie.picture.data) {
            const base64String = Buffer.from(movie.picture.data).toString(
              "utf8"
            );
            return { ...movie, poster: base64String };
          } else {
            return movie;
          }
        });

        setItems(updatedItems);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMovieData();
  }, []);

  const deleteMovie = (id) => {
    fetch(`http://localhost:8080/api/movie/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          const updatedItems = items.filter((item) => item.movie_id !== id);
          setItems(updatedItems);
        } else {
          console.error("Failed to delete movie");
        }
      })
      .catch((error) => console.error(error));
  };

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
        } else {
          console.error("Failed to add movie as watched");
        }
      })
      .catch((error) => console.error(error));
  };

  const isLoggedIn = localStorage.getItem("loggedIn") === "da";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!items || !Array.isArray(items)) {
    return <div>No movies found</div>;
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filteredItems.map((item) => (
        <div key={item.movie_id} className={styles.item}>
          {item.poster && (
            <img
              className={styles.poster}
              src={item.poster}
              alt="Movie Poster"
            />
          )}
          <ul>
            <li className={styles.title} key={`title-${item.movie_id}`}>
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
            <li key={`duration-${item.movie_id}`}>
              <span>Synopsys: </span>
              <span>{item.synopsys}</span>
            </li>
          </ul>
          <div className={styles.buttons}>
            {isLoggedIn && !isAdmin && (
              <div>
                <h2>Add to list as: </h2>
                <p
                  className={styles.button}
                  onClick={() => addToWatchedList(item.movie_id)}
                >
                  Watched
                </p>
              </div>
            )}
            {isAdmin && (
              <div>
                <p
                  className={styles.button}
                  onClick={() => deleteMovie(item.movie_id)}
                >
                  Delete
                </p>
                <p className={styles.button}>Modify</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItemList;
