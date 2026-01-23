const {

  getYouMayKnowService,

  addFriendService,
  confirmFriendService,
  cancelSentRequestService,
  cancelReceivedRequestService,
  unfriendService,
  getMyConnectionsService
} = require("./friendServices");





const getMyConnections = async (req, res) => {
  try {
    const result = await getMyConnectionsService(req)
    res.send(result)
  } catch (error) {
    res.status(500).send(error.message);
  }
}



const youMayKnowController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const suggestions = await getYouMayKnowService(userId);

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};










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
  getMyConnections,
  youMayKnowController,

  addFriend,
  cancelSentRequest,
  cancelReceivedRequest,
  confirmFriend,
  unfriend
}