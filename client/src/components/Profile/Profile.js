import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import "./Profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../CreatePost/CreatePost";
import { getUserProfile } from "../../redux/slices/postSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import userImg from "../../asserts/user.png";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const userProfile = useSelector((state) => state.postReducer.userProfile);
  const feedData = useSelector((state) => state.feedReducer.feedData);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // console.log(myProfile);

  useEffect(() => {
    // console.log("i fire once");
    dispatch(
      getUserProfile({
        userId: params.id,
      })
    );
      console.log("myProfile",myProfile?._id === params.id);
    setIsMyProfile(myProfile?._id === params.id);
    setIsFollowing(
      feedData?.followings?.find((item) => item._id === params.id)
    );
    console.log(isFollowing);
  }, [myProfile, params.id, feedData]);

  // if (userProfile) {
  //   console.log("userProfile", userProfile);
  // }
  function handleFollowUser() {
    dispatch(
      followAndUnfollowUser({
        userIdToFollow: params.id,
      })
    );
  }
  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {userProfile?.posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <div className="user-info">
              <img
                src={userProfile?.avatar?.url || userImg}
                alt="user-img"
                className="user-img"
              />
              <h3>{userProfile?.name}</h3>
              <h5>{userProfile?.bio}</h5>
            </div>
            <div className="followers">
              <h4>{`${userProfile?.followers?.length} Followers`}</h4>
              <h4>{`${userProfile?.followings?.length} Followings`}</h4>
            </div>
            <div className="btn">
              {!isMyProfile && (
                <h5
                  className={
                    isFollowing ? "hover-link follow-link" : "btn-primary"
                  }
                  onClick={handleFollowUser}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </h5>
              )}
              {isMyProfile && (
                <button
                  className="update-profile btn-secondary"
                  onClick={() => navigate("/updateProfile")}
                >
                  Update Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
