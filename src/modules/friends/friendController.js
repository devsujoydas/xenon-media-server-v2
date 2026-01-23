const {
  getMyFriendsService,
  getRequestsService,
  getSentRequestsService,
  getYouMayKnowService,

  addFriendService,
  confirmFriendService,
  cancelSentRequestService,
  cancelReceivedRequestService,
  unfriendService
} = require("./friendServices");





const myFriends = async (req, res) => {
  try {
    const result = getMyFriendsService(req)
    res.send(result)
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const requests = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).send("Email missing");

    const user = await userModel.findOne({ email }).populate("receivedRequests");
    if (!user) return res.status(404).send("User not found");

    res.json(user.receivedRequests || []);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

const sentrequests = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).send("Email missing");

    const user = await userModel.findOne({ email }).populate("sentRequests");
    if (!user) return res.status(404).send("User not found");

    res.json(user.sentRequests || []);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

const youMayKnow = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).send("Email missing");

    const user = await userModel.findOne({ email }).populate("myFriends receivedRequests sentRequests");
    if (!user) return res.status(404).send("User not found");

    const excludeIds = [
      user._id.toString(),
      ...(user.myFriends || []).map(u => u._id.toString()),
      ...(user.receivedRequests || []).map(u => u._id.toString()),
      ...(user.sentRequests || []).map(u => u._id.toString())
    ];

    const allUsers = await userModel.find();
    const youMayKnow = allUsers.filter(u => !excludeIds.includes(u._id.toString()));

    res.json(youMayKnow);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}










const addFriend = async (req, res) => {
  try {
    const result = await addFriendService(req);

    if (result.autoConfirmed) {
      return res.status(200).json({ message: "Friend request auto-confirmed." });
    }

    return res.status(200).json({ message: "Friend request sent." });

  } catch (error) {
    console.error(error);

    switch (error.message) {
      case "CANNOT_ADD_SELF":
        return res.status(400).json({ message: "You cannot add yourself as a friend." });

      case "INVALID_FRIEND_ID":
        return res.status(400).json({ message: "The friend ID is invalid." });

      case "INVALID_FRIEND":
        return res.status(404).json({ message: "Friend not found." });

      case "REQUEST_ALREADY_SENT":
        return res.status(409).json({ message: "Friend request already sent." });

      case "ALREADY_FRIEND":
        return res.status(409).json({ message: "You are already friends." });

      default:
        return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const cancelSentRequest = async (req, res) => {
  try {
    const result = await cancelSentRequestService(req);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    switch (error.message) {
      case "INVALID_FRIEND_ID":
        return res.status(400).json({ message: "The friend ID is invalid." });

      case "INVALID_FRIEND":
        return res.status(404).json({ message: "Friend not found." });

      case "NO_SENT_REQUEST":
        return res.status(409).json({ message: "No sent friend request to cancel." });

      default:
        return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const confirmFriend = async (req, res) => {
  try {
    const result = await confirmFriendService(req);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    switch (error.message) {
      case "INVALID_FRIEND_ID":
        return res.status(400).json({ message: "The friend ID is invalid." });

      case "CANNOT_ADD_SELF":
        return res.status(400).json({ message: "You cannot add yourself as a friend." });

      case "INVALID_FRIEND":
        return res.status(404).json({ message: "Friend not found." });

      case "NO_REQUEST_FOUND":
        return res.status(409).json({ message: "No friend request found from this user." });

      case "ALREADY_FRIEND":
        return res.status(409).json({ message: "You are already friends." });

      default:
        return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const cancelReceivedRequest = async (req, res) => {
  try {
    const result = await cancelReceivedRequestService(req);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    switch (error.message) {
      case "INVALID_FRIEND_ID":
        return res.status(400).json({ message: "The friend ID is invalid." });

      case "INVALID_FRIEND":
        return res.status(404).json({ message: "Friend not found." });

      case "NO_RECEIVED_REQUEST":
        return res.status(409).json({ message: "No received friend request to cancel." });

      default:
        return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const unfriend = async (req, res) => {
  try {
    const result = await unfriendService(req);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    switch (error.message) {
      case "INVALID_FRIEND_ID":
        return res.status(400).json({ message: "The friend ID is invalid." });

      case "INVALID_FRIEND":
        return res.status(404).json({ message: "Friend not found." });

      case "NOT_FRIEND":
        return res.status(409).json({ message: "You are not friends." });

      default:
        return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};






module.exports = {
  myFriends,
  requests,
  sentrequests,
  youMayKnow,

  addFriend,
  cancelSentRequest,
  cancelReceivedRequest,
  confirmFriend,
  unfriend
}