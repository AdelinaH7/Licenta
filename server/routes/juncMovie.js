const express = require("express");
const router = express.Router();
const juncMovieController = require("../controllers").juncMovie;

router.get("/", juncMovieController.getAllJuncsMovie); //merge
router.get("/users/:id", juncMovieController.getAllUsersOfMovie); //merge
router.get("/movies", juncMovieController.getAllMoviesOfUser); //merge
router.get("/:user_id/:movie_id", juncMovieController.getJuncMovieById);
router.post("/:id", juncMovieController.createJuncMovie); //merge
/*http://localhost:8080/api/juncMovie/3 (movie id)
{
    "user" : {
        "user_id" : 4 (user id)
    },
    "movie_id": 1
}*/
router.delete("/:user_id/:movie_id", juncMovieController.deleteJuncMovie); //merge brici

module.exports = router;
