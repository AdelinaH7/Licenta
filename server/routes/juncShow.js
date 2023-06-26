const express = require("express");
const router = express.Router();
const juncShowController = require("../controllers").juncShow;

router.get("/", juncShowController.getAllJuncsShow);
router.get("/users/:id", juncShowController.getAllUsersOfShow);
router.get("/shows/:user_id", juncShowController.getAllShowsOfUser);
router.get("/:user_id/:show_id", juncShowController.getJuncShowById);
router.post("/:id", juncShowController.createJuncShow);
router.put("/:user_id/:show_id/favorite", juncShowController.updateJuncShow);
router.put("/:user_id/:show_id/score", juncShowController.updateJuncShowScore);
router.delete("/:user_id/:show_id", juncShowController.deleteJuncShow);

module.exports = router;
