const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.route("/").post(userController.createUser).get(userController.getUsers);

router
	.route("/:userId")
	.get(userController.getUser)
	.put(userController.updateUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
