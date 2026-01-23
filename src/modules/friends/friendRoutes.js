const express = require("express");
const router = express.Router();

const isVerifyUser = require("../../middlewares/verifyUser");
const {
    myFriends,
    requests,
    sentrequests,
    youMayKnow,
    addFriend,
    cancelSentRequest,
    cancelReceivedRequest,
    confirmFriend,
    unfriend
} = require("./friendController");




router.put("/friend/:userId/addfriend", isVerifyUser, addFriend);
router.put("/friend/:userId/cancel-sent-request", isVerifyUser, cancelSentRequest);
router.put("/friend/:userId/confirmfriend", isVerifyUser, confirmFriend);
router.put("/friend/:userId/cancel-received-request", isVerifyUser, cancelReceivedRequest);
router.put("/friend/:userId/unfriend", isVerifyUser, unfriend);




router.get("/myfriends", isVerifyUser, myFriends); 
router.get("/received-requests", isVerifyUser, requests);
router.get("/sent-request", isVerifyUser, sentrequests);
router.get("/youMayKnow", isVerifyUser, youMayKnow); 




module.exports = router;