const express = require("express");
const router = express.Router();

const validateUserRoute = require("./validateUser");
const test = require("./test");
const validateTokenRoute = require("./validateToken");
const updateCreds = require("./updateCreds")
const updateLocation = require("./updateLocation")
const getLocation = require("./getLocation")
const tablesRoute = require("./getTables");
const addTableRoute = require("./addTable");
const deleteTableRoute = require("./deleteTable");
const getMenu = require("./getMenu");
const delMenuItem = require("./deleteMenuItem");
const addMenuitem = require("./addMenuItem")
const validateLocation= require("./validateLocation")
const validateOrderToken= require("./validateOrderToken")
const getOrders = require("./getOrders")
const putSeen = require("./putSeen")



router.use("/", test);
router.use("/validate", validateUserRoute);
router.use("/validate-token", validateTokenRoute);
router.use("/update-creds", updateCreds);
router.use("/update-location", updateLocation);
router.use("/get-location", getLocation);
router.use("/tables", tablesRoute);
router.use("/add-table", addTableRoute);
router.use("/delete-table", deleteTableRoute);
router.use("/menu", getMenu);
router.use("/delete-menu", delMenuItem);
router.use("/add-menu-item", addMenuitem);
router.use("/validate-location", validateLocation);
router.use("/validate-order-token", validateOrderToken);
router.use("/get-orders", getOrders);
router.use("/put-seen", putSeen);


module.exports = router;
