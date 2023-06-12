const express = require("express");
const router = express.Router();
const juncShowController = require("../controllers").juncShow;

router.get("/", juncShowController.getAllJuncsShow);
router.get("/users/:id", juncShowController.getAllUsersOfShow);
router.get("/shows", juncShowController.getAllShowsOfUser);
router.get("/:user_id/:show_id", juncShowController.getJuncShowById);
router.post("/:id", juncShowController.createJuncShow);
router.delete("/:user_id/:show_id", juncShowController.deleteJuncShow);

module.exports = router;
