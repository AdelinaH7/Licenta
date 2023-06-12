const express = require("express");
const router = express.Router();
const showController = require("../controllers").show;

router.get("/", showController.getAllShows);
router.get("/:id", showController.getShowById);
router.post("/", showController.createShow);
/*router.put("/:id", showController.updateMovie);*/
router.delete("/:id", showController.deleteShow);

module.exports = router;
