import React from 'react';
import userImg from '../../asserts/user.png';
import './Avatar.scss'

const Avatar = ({src}) => {
  return (
    <>
    <div className="Avatar hover-link">
        <img src={src ? src : userImg} alt="userImage" />
    </div>
    </>
  )
}

export default Avatar