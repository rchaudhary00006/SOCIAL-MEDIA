import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile } from "../../redux/slices/appConfigSlice";
import userImg from "../../asserts/user.png"


const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setImgUrl(myProfile?.avatar?.url || "");
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if(!file){
      return
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        // console.log(fileReader.result);
        setImgUrl(fileReader.result);
      }
    };
  }

  function handleSubmit(e){
    e.preventDefault();
    dispatch(updateMyProfile({
      name,
      bio,
      userImg:imgUrl
    }))
  }

  return (
    <div className="updateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="labelImg">
              <img src={imgUrl ? imgUrl : userImg} alt={name} />
            </label>
            <input
              className="inputImg"
              type="file"
              id="inputImg"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              value={bio}
              type="text"
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <input type="submit" className="btn-primary" onClick={handleSubmit}/>
          </form>
          <button className="delete-account btn-primary">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
