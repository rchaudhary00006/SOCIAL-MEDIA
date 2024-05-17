const {
  loginController,
  signupController,
  deleteController,
  refreshAccessTokenController,
  logoutController,
} = require("../contollers/authContoller");

const router = require("express").Router();

router.post("/login", loginController);
router.post("/signup", signupController);
router.post("/delete/:email", deleteController);
router.get("/refresh" ,refreshAccessTokenController);
router.post('/logout',logoutController)

module.exports = router;
  