import React, { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import "./Follower.scss";
import { useDispatch, useSelector } from "react-redux";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import { useNavigate } from "react-router-dom";

const Follower = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feedData = useSelector((state) => state.feedReducer.feedData);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(feedData.followings.find((item) => item._id === user._id));
  }, []);

  function handleFollowUser(){
    dispatch(followAndUnfollowUser({
      userIdToFollow : user._id
    }))
  }
  return (
    <div className="Follower">
      <div className="user-info" onClick={()=>navigate(`/profile/${user._id}`)}>
        <Avatar src={user?.avatar?.url} />
        <h4>{user?.name}</h4>
      </div>
      <h5 className={isFollowing ? "hover-link follow-link" : "btn-primary"} onClick={handleFollowUser}>
        {isFollowing ? "Unfollow" : "Follow"}
      </h5>
    </div>
  );
};

export default Follower;
