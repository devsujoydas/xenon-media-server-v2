const express = require("express");
const router = express.Router();

const isVerifyUser = require("../../middlewares/verifyUser");
const {
    getMyConnections,
    addFriend,
    cancelSentRequest,
    cancelReceivedRequest,
    confirmFriend,
    unfriend,
    youMayKnowController
} = require("./friendController");




router.put("/friend/:userId/addfriend", isVerifyUser, addFriend);
router.put("/friend/:userId/cancel-sent-request", isVerifyUser, cancelSentRequest);
router.put("/friend/:userId/confirmfriend", isVerifyUser, confirmFriend);
router.put("/friend/:userId/cancel-received-request", isVerifyUser, cancelReceivedRequest);
router.put("/friend/:userId/unfriend", isVerifyUser, unfriend);




router.get("/myConnections", isVerifyUser, getMyConnections);  
router.get("/youMayKnow", isVerifyUser, youMayKnowController); 




module.exports = router;