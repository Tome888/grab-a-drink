const express = require("express");
const router = express.Router();

const validateUserRoute = require("./validateUser");
const test = require("./test");
const validateTokenRoute = require("./validateToken");
const updateCreds = require("./updateCreds")


router.use("/", test);
router.use("/validate", validateUserRoute);
router.use("/validate-token", validateTokenRoute);
router.use("/update-creds", updateCreds);


module.exports = router;
