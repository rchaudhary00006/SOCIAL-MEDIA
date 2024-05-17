import React, { useEffect } from "react";
import "./Feed.scss";
import Post from "../Post/Post";
import Follower from "../Followers/Follower";
import { useDispatch , useSelector } from "react-redux";
import { getFeedData } from "../../redux/slices/feedSlice";

const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((state)=>state.feedReducer.feedData)
  console.log("Feed Data Here",feedData);

  useEffect(()=>{
    dispatch(getFeedData())
  },[dispatch])
  return (
    <div className="Feed">
      <div className="container">
        <div className="left-part">
          {feedData?.posts?.map((post)=> <Post key={post._id} post={post}/>)}
        </div>
        <div className="right-part">
          <div className="followers">
            <h4 className="title">You are following</h4>
            {feedData?.followings?.map((user)=><Follower key={user._id} user={user}/>)}
          </div>
          <div className="suggestions">
            <h4 className="title">Suggested For You</h4>
            {feedData?.suggestions?.map((user)=><Follower key={user._id} user={user}/>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
