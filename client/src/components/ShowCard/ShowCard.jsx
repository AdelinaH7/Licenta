import React, { useState, useEffect } from "react";
import styles from "./ShowCard.module.css";
import { Buffer } from "buffer";

function ShowCard() {
  const [shows, setShows] = useState([]);
  const [scores, setScores] = useState({});
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showResponse = await fetch(
          `http://localhost:8080/api/juncShow/shows/${localStorage.getItem(
            "id"
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!showResponse.ok) {
          throw new Error("Failed to fetch show data");
        }

        const scoreResponse = await fetch(
          `http://localhost:8080/api/juncShow/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!scoreResponse.ok) {
          throw new Error("Failed to fetch score data");
        }

        const showData = await showResponse.json();
        const scoreData = await scoreResponse.json();

        const updatedScores = scoreData.reduce((acc, scoreItem) => {
          acc[scoreItem.show_id] = scoreItem.score;
          return acc;
        }, {});

        const updatedShows = showData.map((show) => {
          if (show.picture && show.picture.data) {
            const base64String = Buffer.from(show.picture.data).toString(
              "utf8"
            );
            return { ...show, picture: base64String };
          } else {
            return show;
          }
        });

        const updatedFavorites = showData.reduce((acc, showItem) => {
          acc[showItem.show_id] = showItem.isFavourite;
          return acc;
        }, {});

        setShows(updatedShows);
        setScores(updatedScores);
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const updateFavoriteStatus = async (showId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/juncShow/${localStorage.getItem(
          "id"
        )}/${showId}/favorite`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isFavourite: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
      console.log("Favorite status updated successfully:", showId, newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteStatusChange = async (showId, newStatus) => {
    updateFavoriteStatus(showId, newStatus);
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [showId]: newStatus,
    }));
  };

  const deleteShow = async (showId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/juncShow/${localStorage.getItem(
          "id"
        )}/${showId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete show");
      }

      setShows((prevShows) =>
        prevShows.filter((show) => show.show_id !== showId)
      );
      console.log("Show deleted successfully:", showId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScoreChange = async (event, showId) => {
    const newScore = parseInt(event.target.value, 10);
    setScores((prevScores) => ({ ...prevScores, [showId]: newScore }));
    updateScore(showId, newScore);
  };

  const handleUnwatched = async (showId) => {
    deleteShow(showId);
  };

  const updateScore = async (showId, newScore) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/juncShow/${localStorage.getItem(
          "id"
        )}/${showId}/score`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score: newScore }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update score");
      }
      console.log("Score updated successfully:", showId, newScore);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      {shows.map((show) => (
        <ShowItem
          key={show.show_id}
          show={show}
          isFavorite={favorites[show.show_id] || false}
          score={scores[show.show_id] || ""}
          onScoreChange={handleScoreChange}
          onFavoriteStatusChange={handleFavoriteStatusChange}
          onUnwatched={handleUnwatched}
        />
      ))}
    </div>
  );
}

function ShowItem({
  show,
  score,
  isFavorite,
  onScoreChange,
  onUnwatched,
  onFavoriteStatusChange,
  onFavoriteChange,
}) {
  const { show_id, name, picture } = show;

  return (
    <div className={styles.card}>
      <img src={picture} alt={name} className={styles.image} />
      <h2 className={styles.title}>{name}</h2>
      <div className={styles.buttons}>
        <button
          className={styles.buttonUnwatched}
          onClick={() => onUnwatched(show_id)}
        >
          Unwatched
        </button>
        <button
          className={styles.buttonFavorite}
          onClick={() => onFavoriteStatusChange(show_id, !isFavorite)}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
      <select
        className={styles.selected}
        value={score}
        onChange={(event) => onScoreChange(event, show_id)}
      >
        <option value="">Select score</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
      <div>Your score: {score}</div>
    </div>
  );
}

export default ShowCard;
