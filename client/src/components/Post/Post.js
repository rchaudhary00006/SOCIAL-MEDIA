import React from "react";
import "./Post.scss";
import Avatar from "../Avatar/Avatar";
import { useDispatch } from "react-redux";
import { likeandUnlike } from "../../redux/slices/postSlice";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
const Post = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleLikeAndUnlike() {
    dispatch(
      showToast({
        type: TOAST_SUCCESS,
        message: "Post Liked or Disliked",
      })
    );
    dispatch(
      likeandUnlike({
        postId: post?._id,
      })
    );
  }
  return (
    <div className="Post">
      <div
        className="heading"
        onClick={() => navigate(`/profile/${post.owner._id}`)}
      >
        <Avatar src={post?.owner?.avatar?.url} />
        <h4>{post?.owner?.name}</h4>
      </div>
      <div className="content" onDoubleClick={handleLikeAndUnlike}>
        <img src={post?.image?.url} alt="" />
      </div>
      <div className="footer">
        <div className="like" onClick={handleLikeAndUnlike}>
          {post.isLiked ? (
            <FaHeart className="icon" style={{ color: "red" }} />
          ) : (
            <FaRegHeart className="icon" />
          )}
          <h4>{`${post?.likesCount} likes`}</h4>
        </div>
        <div className="caption">{post?.caption}</div>
        <h6 className="time-ago">{post?.timeAgo}</h6>
      </div>
    </div>
  );
};

export default Post;
