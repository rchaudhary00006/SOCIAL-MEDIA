const User = require("../models/userModel");
const Post = require("../models/post");
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/utils");
const cloudinary = require("cloudinary").v2;

const followAndUnfollowController = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const currUserId = req.id;

    const userToFollow = await User.findById(userIdToFollow);
    const currUser = await User.findById(currUserId);

    if (userIdToFollow === currUserId) {
      return res.send(error(409, "Cannot Follow Yourself"));
    }

    if (!userIdToFollow) {
      return res.send(error(404, "User To Follow Not Found"));
    }

    if (currUser.followings.includes(userIdToFollow)) {
      //already followed
      const followingIndex = currUser.followings.indexOf(userIdToFollow);
      currUser.followings.splice(followingIndex, 1);

      const followerIndex = userToFollow.followings.indexOf(userIdToFollow);
      userToFollow.followers.splice(followerIndex, 1);

    } else {
      currUser.followings.push(userIdToFollow);
      userToFollow.followers.push(currUserId);
    }
    await currUser.save();
    await userToFollow.save();

    return res.send(success(200, {user:userToFollow}));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getPostOfFollowingController = async (req, res) => {
  try {
    const currUserId = req.id;
    // console.log(currUserId);

    const currUser = await User.findById(currUserId).populate("followings");

    const allPosts = await Post.find({
      owner: {
        $in: currUser.followings,
      },
    }).populate("owner");

    const posts = allPosts
      .map((item) => mapPostOutput(item, currUserId))
      .reverse();
    const followingsId = currUser.followings.map((item) => item._id);
    followingsId.push(req.id);
    const suggestions = await User.find({
      _id: {
        $nin: followingsId,
      },
    });

    return res.send(success(200, { ...currUser._doc, suggestions, posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyPostController = async (req, res) => {
  try {
    const userId = req.id;
    const post = await Post.find({
      owner: userId,
    })
      .populate("likes")
      .populate("comments");
    if (post.length === 0) {
      return res.send(error(404, "No Posts Found"));
    }
    return res.send(success(200, post));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUsersPostController = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.send(error(400, "UserId is required"));
    }
    const post = await Post.find({
      owner: userId,
    }).populate("likes");

    if (post.length === 0) {
      return res.send(error(404, "No Posts Found"));
    }
    return res.send(success(200, post));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteMyProfileController = async (req, res) => {
  try {
    const userId = req.id;
    // console.log("User", userId);
    const currUser = await User.findById(userId);
    if (!currUser) {
      return res.send(error(404, "User Not Found"));
    }
    console.log(currUser);
    //deleting all the posts

    await Post.deleteMany({
      owner: userId,
    });

    //deleting the currUser from their followers following lists

    currUser.followers.forEach(async (followerId) => {
      const follower = await User.findById(followerId);
      const index = follower.followings.indexOf(userId);
      follower.followings.splice(index, 1);
      await follower.save();
    });

    //deleting the currUser from the followers of his followings

    currUser.followings.forEach(async (followingId) => {
      const following = await User.findById(followingId);
      const index = following.followers.indexOf(userId);
      following.followers.splice(index, 1);
      await following.save();
    });

    // deleting the user from the likes (Array)

    const allPostLikedByCurrUser = await Post.find({
      likes: {
        $in: userId,
      },
    });

    allPostLikedByCurrUser.map(async (post) => {
      const index = post.likes.indexOf(userId);
      post.likes.splice(index, 1);
      await post.save();
    });

    await currUser.deleteOne();
    res.send(success(200, "User Deleted"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyInfoController = async (req, res) => {
  try {
    const currUserId = req.id;
    const user = await User.findById(currUserId);

    return res.send(success(200, user));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updateUserProfileController = async (req, res) => {
  try {
    const { name, bio, userImg } = req.body;
    const currUser = await User.findById(req.id);

    if (name) {
      currUser.name = name;
    }
    if (bio) {
      currUser.bio = bio;
    }
    if (userImg) {
      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImg",
      });
      currUser.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }
    await currUser.save();
    return res.send(success(200, currUser));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });
    const allPosts = user.posts;
    const posts = allPosts.map((item) => mapPostOutput(item, userId)).reverse();

    return res.send(success(200, { ...user._doc, posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

//deleteMyProfile --> likes comments followers  handle karne honge isme
module.exports = {
  followAndUnfollowController,
  getPostOfFollowingController,
  getMyPostController,
  getUsersPostController,
  deleteMyProfileController,
  getMyInfoController,
  updateUserProfileController,
  getUserProfileController,
};
