const { success, error } = require("../utils/responseWrapper");
const User = require("../models/userModel");
const Post = require("../models/post");
const Comment = require("../models/comments");
const { mapPostOutput } = require("../utils/utils");
const cloudinary = require("cloudinary").v2;

const getAllPostController = async (req, res) => {
  //   console.log(req._id);
  // res.send("These are all the Posts");
  res.send(success(200, "These are all the Posts"));
};

const createPostController = async (req, res) => {
  try {
    const { caption, postImg } = req.body;
    
    if (!caption || !postImg) {
      return res.send(error(400, "Captions  and Image Both are required"));
    }

    const cloudImg = await cloudinary.uploader.upload(postImg, {
      folder: "postImg",
    });

    const owner = req.id;
    console.log(owner);
    const user = await User.findById(req.id);

    const newPost = new Post({
      owner,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.secure_url,
      },
    });
    const post = await newPost.save();

    user.posts.push(post._id);
    await user.save();

    return res.send(success(201, post));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const likeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const currUserId = req.id;
    //   console.log("UserId", currUserId);
    const post = await Post.findById(postId).populate('owner');
    // console.log("Post", post);
    if (!post) {
      return res.send(error(404, "Post not Found"));
    }

    if (post.likes.includes(currUserId)) {
      const index = post.likes.indexOf(currUserId);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(currUserId);
    }

    await post.save();

    return res.send(success(200, {post:mapPostOutput(post,req.id)}));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  const { postId, caption } = req.body;
  const currUserId = req.id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.send(error(404, "Post not found"));
  }

  if (post.owner.toString() !== currUserId) {
    return res.send(error(403, "Only owner can update their posts"));
  }

  if (caption) {
    post.caption = caption;
  }
  await post.save();
  return res.send(success(200, post));
};

const deletePostcontoller = async (req, res) => {
  try {
    const { postId } = req.body;
    const currUserId = req.id;

    const post = await Post.findById(postId);
    const user = await User.findById(currUserId);
    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== currUserId) {
      return res.send(error(403, "Only owner can delete their posts"));
    }
    const index = user.posts.indexOf(postId);
    user.posts.splice(index, 1);
    await user.save();
    await post.deleteOne();
    return res.send(success(200, "Post Deleted"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const createCommentController = async (req, res) => {
  const { message, postId } = req.body;
  const currUserId = req.id;

  if (!message || !postId) {
    return res.send(
      error(400, "Message and postId are required in order to make a Comment")
    );
  }

  const post = await Post.findById(postId);
  const comment = await new Comment({
    message,
    owner: currUserId,
  });

  post.comments.push(comment._id);
  await comment.save();
  await post.save();

  return res.send(success(200, post));
};
module.exports = {
  getAllPostController,
  createPostController,
  likeAndUnlikePost,
  updatePostController,
  deletePostcontoller,
  createCommentController,
};
