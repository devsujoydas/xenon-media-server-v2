const express = require("express");
const router = express.Router();
 
const {
    getMyConnections,
    addFriend,
    cancelSentRequest,
    cancelReceivedRequest,
    confirmFriend,
    unfriend,
    youMayKnowController
} = require("./friendController");
const authorizeRoles = require("../../middlewares/authorizeRoles");




router.put("/friend/:userId/addfriend", authorizeRoles(), addFriend);
router.put("/friend/:userId/cancel-sent-request", authorizeRoles(), cancelSentRequest);
router.put("/friend/:userId/confirmfriend", authorizeRoles(), confirmFriend);
router.put("/friend/:userId/cancel-received-request", authorizeRoles(), cancelReceivedRequest);
router.put("/friend/:userId/unfriend", authorizeRoles(), unfriend);




router.get("/myConnections", authorizeRoles(), getMyConnections);  
router.get("/youMayKnow", authorizeRoles(), youMayKnowController); 




module.exports = router;