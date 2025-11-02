const express = require("express");
const router = express.Router();

const { getAllUser, getFriend, myFriends, requests, sentrequest, youMayKnow, addFriend, cancelsentrequest, cancelreceivedrequest, confirmFriend, unfriend } = require("./friendController");



router.get("/allUsers", getAllUser);
router.get("/:username", getFriend);
router.get("/myfriends", myFriends);
router.get("/requests", requests);
router.get("/sentrequest", sentrequest);
router.get("/youMayKnow", youMayKnow);

router.put("/addfriend", addFriend);
router.put("/cancelsentrequest", cancelsentrequest);
router.put("/cancelreceivedrequest", cancelreceivedrequest);
router.put("/confirmFriend", confirmFriend);
router.put("/unfriend", unfriend);


module.exports = router;