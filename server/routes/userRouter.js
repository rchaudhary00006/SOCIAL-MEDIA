const {
  followAndUnfollowController,
  getPostOfFollowingController,
  getMyPostController,
  getUsersPostController,
  deleteMyProfileController,
  getMyInfoController,
  updateUserProfileController,
  getUserProfileController
} = require("../contollers/UserControllers");
const requireUser = require("../middlewares/requireUser");

const router = require("express").Router();

router.post("/follow", requireUser, followAndUnfollowController);
router.get("/getFeedData", requireUser, getPostOfFollowingController);
router.get("/getmypost", requireUser, getMyPostController);
router.get("/getuserspost",requireUser, getUsersPostController);
router.delete('/deleteUser',requireUser,deleteMyProfileController);
router.get('/getMyInfo',requireUser,getMyInfoController);
router.put('/updateProfile',requireUser,updateUserProfileController);
router.post('/getUserProfile',requireUser,getUserProfileController);

module.exports = router;
