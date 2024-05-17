import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import "./CreatePost.scss";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postSlice";

const CreatePost = () => {
  const [postImg, setPostImg] = useState("");
  const [caption , setCaption] = useState("");
  const dispatch = useDispatch();

  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if(!file){
      return
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        console.log(fileReader.result);
        setPostImg(fileReader.result);
      }
    };
  }
  async function handlePost(){
    try {
      const response = await axiosClient.post('/post/',{
        caption,
        postImg
      })
      console.log("post done", response)
      dispatch(getUserProfile({
        userId : myProfile._id
      }));
    } catch (error) {
      
    }finally{
      setCaption("");
      setPostImg("");
    }
   
  }
  return (
    <div className="CreatePost">
      <div className="leftPart">
        <Avatar src={myProfile?.avatar?.url}/>
      </div>
      <div className="rightPart">
        <input
        value={caption}
          type="text"
          className="captionInput"
          placeholder="What's on your mind?"
          onChange={(e)=> setCaption(e.target.value)}
        />
        {postImg && (
          <div className="img-container">
            <img className="post-img" src={postImg} alt="" />
          </div>
        )}

        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className="labelImg">
              <BsCardImage />
            </label>
            <input
              className="inputImg"
              type="file"
              id="inputImg"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button className="post-btn btn-primary"  onClick={handlePost}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
