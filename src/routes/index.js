const express = require("express");
const httpStatus = require("http-status");
const config = require("../config/config");
const { name } = require("../../package.json");

const docsRoute = require("./docs.route");
const userRoute = require("./user.route");

const router = express.Router();

router.get("/", function (req, res, next) {
	res.status(httpStatus.OK).render("api_online", { title: name });
});

router.use("/users", userRoute);

if (config.env === "development") {
	router.use("/docs", docsRoute);
}

module.exports = router;
