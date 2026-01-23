const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");
const User = require("../users/userModel");

const getMyFriendsService = async (req) => {
    const id = req.user.id;
    const user = await User.findById({ _id: id })
    if (!user) throw new Error("USER_NOT_FOUND")
    console.log(user)


}

const getRequestsService = async (req) => {

}
const getSentRequestsService = async (req) => {

}
const getYouMayKnowService = async (req) => {

}





const addFriendService = async (req) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const friendId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(friendId)) throw new Error("INVALID_FRIEND_ID");

  const friendObjectId = new mongoose.Types.ObjectId(friendId);

  if (userId.equals(friendObjectId)) throw new Error("CANNOT_ADD_SELF");

  const me = await User.findById(userId);
  const friend = await User.findById(friendObjectId);

  if (!friend) throw new Error("INVALID_FRIEND");

  const myFriends = me.myFriends || [];
  const sentRequests = me.sentRequests || [];
  const receivedRequests = me.receivedRequests || [];

  if (myFriends.find(f => f.userId.equals(friendObjectId))) throw new Error("ALREADY_FRIEND");

  const reverseRequest = receivedRequests.find(req => req.userId.equals(friendObjectId));
  if (reverseRequest) {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { myFriends: { userId: friendObjectId, since: new Date() } },
      $pull: { receivedRequests: { userId: friendObjectId } }
    });

    await User.findByIdAndUpdate(friendObjectId, {
      $addToSet: { myFriends: { userId: userId, since: new Date() } },
      $pull: { sentRequests: { userId: userId } }
    });

    return { autoConfirmed: true };
  }

  if (sentRequests.find(req => req.userId.equals(friendObjectId))) throw new Error("REQUEST_ALREADY_SENT");

  await User.findByIdAndUpdate(userId, {
    $addToSet: { sentRequests: { userId: friendObjectId, requestedAt: new Date() } }
  });

  await User.findByIdAndUpdate(friendObjectId, {
    $addToSet: { receivedRequests: { userId: userId, requestedAt: new Date() } }
  });

  return { autoConfirmed: false };
};

const cancelSentRequestService = async (req) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const friendId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(friendId)) throw new Error("INVALID_FRIEND_ID");

  const friendObjectId = new mongoose.Types.ObjectId(friendId);

  const me = await User.findById(userId);
  const friend = await User.findById(friendObjectId);

  if (!friend) throw new Error("INVALID_FRIEND");

  const sentRequests = me.sentRequests || [];

  const existingRequest = sentRequests.find(req => req.userId.equals(friendObjectId));
  if (!existingRequest) throw new Error("NO_SENT_REQUEST");

  await User.findByIdAndUpdate(userId, {
    $pull: { sentRequests: { userId: friendObjectId } }
  });

  await User.findByIdAndUpdate(friendObjectId, {
    $pull: { receivedRequests: { userId: userId } }
  });

  return { message: "Friend request cancelled" };
};

const confirmFriendService = async (req) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const friendId = req.params.userId;
    const friendObjectId = new mongoose.Types.ObjectId(friendId);

    if (!mongoose.Types.ObjectId.isValid(friendId)) throw new Error("INVALID_FRIEND_ID");
    if (userId.equals(friendObjectId)) throw new Error("CANNOT_ADD_SELF");

    const me = await User.findById(userId);
    const friend = await User.findById(friendObjectId);

    if (!friend) throw new Error("INVALID_FRIEND");

    const received = me.receivedRequests || [];
    const requestExists = received.find(req => req.userId.equals(friendObjectId));
    if (!requestExists) throw new Error("NO_REQUEST_FOUND");

    await User.findByIdAndUpdate(friendObjectId, {
        $pull: { sentRequests: { userId: userId } }
    });

    await User.findByIdAndUpdate(userId, {
        $pull: { receivedRequests: { userId: friendObjectId } }
    });

    await User.findByIdAndUpdate(userId, {
        $addToSet: { myFriends: { userId: friendObjectId, since: new Date() } }
    });

    await User.findByIdAndUpdate(friendObjectId, {
        $addToSet: { myFriends: { userId: userId, since: new Date() } }
    });

    return { message: "Friend request confirmed" };
};

const cancelReceivedRequestService = async (req) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const friendId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(friendId)) throw new Error("INVALID_FRIEND_ID");

  const friendObjectId = new mongoose.Types.ObjectId(friendId);

  const me = await User.findById(userId);
  const friend = await User.findById(friendObjectId);

  if (!friend) throw new Error("INVALID_FRIEND");

  const receivedRequests = me.receivedRequests || [];

  const existingRequest = receivedRequests.find(req => req.userId.equals(friendObjectId));
  if (!existingRequest) throw new Error("NO_RECEIVED_REQUEST");

  await User.findByIdAndUpdate(userId, {
    $pull: { receivedRequests: { userId: friendObjectId } }
  });

  await User.findByIdAndUpdate(friendObjectId, {
    $pull: { sentRequests: { userId: userId } }
  });

  return { message: "Received friend request cancelled" };
};

const unfriendService = async (req) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const friendId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(friendId)) throw new Error("INVALID_FRIEND_ID");

  const friendObjectId = new mongoose.Types.ObjectId(friendId);

  const me = await User.findById(userId);
  const friend = await User.findById(friendObjectId);

  if (!friend) throw new Error("INVALID_FRIEND");

  const myFriends = me.myFriends || [];

  const existingFriend = myFriends.find(f => f.userId.equals(friendObjectId));
  if (!existingFriend) throw new Error("NOT_FRIEND");

  await User.findByIdAndUpdate(userId, {
    $pull: { myFriends: { userId: friendObjectId } }
  });

  await User.findByIdAndUpdate(friendObjectId, {
    $pull: { myFriends: { userId: userId } }
  });

  return { message: "Unfriended successfully" };
};








module.exports = {
    getMyFriendsService,
    getRequestsService,
    getSentRequestsService,
    getYouMayKnowService,

    addFriendService,
    cancelSentRequestService,
    unfriendService,
    cancelReceivedRequestService,
    confirmFriendService,

}