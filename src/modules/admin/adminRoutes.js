const express = require("express");
const { makeAdmin, removeAdmin } = require("./adminControllers");
const router = express.Router()







router.put("/make-admin/:email", makeAdmin);
router.put("/remove-admin/:email", removeAdmin);



module.exports = router 