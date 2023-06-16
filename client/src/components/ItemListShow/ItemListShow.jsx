import React, { useState, useEffect } from "react";
import styles from "./ItemListShow.module.css";
import { Buffer } from "buffer";

function ItemListShow({ searchTerm }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/show`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch show data");
        }

        const data = await response.json();

        const updatedItems = data.map((show) => {
          if (show.picture && show.picture.data) {
            const base64String = Buffer.from(show.picture.data).toString(
              "utf8"
            );
            return { ...show, poster: base64String };
          } else {
            return show;
          }
        });

        setItems(updatedItems);
      } catch (err) {
        console.log(err);
      }
    };

    fetchShowData();
  }, []);

  const deleteShow = (id) => {
    fetch(`http://localhost:8080/api/show/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          const updatedItems = items.filter((item) => item.show_id !== id);
          setItems(updatedItems);
        } else {
          console.error("Failed to delete show");
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

    fetch(`http://localhost:8080/api/juncShow/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
        } else {
          console.error("Failed to add show as watched");
        }
      })
      .catch((error) => console.error(error));
  };

  const isLoggedIn = localStorage.getItem("loggedIn") === "da";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!items || !Array.isArray(items)) {
    return <div>No shows found</div>;
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filteredItems.map((item) => (
        <div key={item.show_id} className={styles.item}>
          {item.poster && (
            <img
              className={styles.poster}
              src={item.poster}
              alt="show Poster"
            />
          )}
          <ul>
            <li key={`title-${item.show_id}`}>
              <span>Title: </span>
              <span>{item.name}</span>
            </li>
            <li key={`genre-${item.show_id}`}>
              <span>Genre: </span>
              <span>{item.genre}</span>
            </li>
            <li key={`release-${item.show_id}`}>
              <span>Release Date: </span>
              <span>{item.releaseDate}</span>
            </li>
            <li key={`episodes-${item.show_id}`}>
              <span>Number of episodes: </span>
              <span>{item.episodes}</span>
            </li>
          </ul>
          <div className={styles.buttons}>
            {isLoggedIn && !isAdmin && (
              <div>
                <h2>Add to list as: </h2>
                <p
                  className={styles.button}
                  onClick={() => addToWatchedList(item.show_id)}
                >
                  Watched
                </p>
              </div>
            )}
            {isAdmin && (
              <div>
                <p
                  className={styles.button}
                  onClick={() => deleteShow(item.show_id)}
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

export default ItemListShow;
