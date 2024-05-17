const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  const { email, password,name,bio } = req.body;

  if (!email || !password || !name) {
    // return res.status(400).send("Email and Password are mandatory in order to login");
    return res.send(
      error(400, "Email and Password are mandatory in order to login")
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOne({ email });
  console.log("hiii");
  if (user) {
    // return res.status(409).send("User Already Exists");
    return res.send(error(409, "Email is Already Exists"));
  }

  const newUser = await new User({
    name,
    email,
    password: hashedPassword,
    // bio
  });
  const temp2 = await newUser.save();

  // const tempUser = await User.findById(temp2._id);

  // return res.status(201).json({tempUser});
  console.log("hiii");
  return res.send(success(201, 'User Created Successfully'));
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    //return res.status(400).send("Email and Password are mandatory in order to login");
    return res.send(
      error(400, "Email and Password are mandatory in order to login")
    );
  }

  const user = await User.findOne({ email }).select('+password');

  //+password karne se password field ko bhi include kar lega findOne mthd

  if (!user) {
    // return res.status(404).send("User Not Found");
    return res.send(error(404, "User Not Found"));
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    // return res.status(403).send("Invalid Password");
    return res.send(error(403, "Invalid Password"));
  }
  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  res.cookie("jwt", refreshToken, {
    httpOnly: true, //Ab ye wale cookie ko frontend access nhi kar skta with js
    secure: true,
  });
  // res.status(200).send({ accessToken });
  return res.send(success(200, { accessToken }));
};

const logoutController = async (req , res)=>{
  try {
    res.clearCookie('jwt',{  //This clearCookie method will clears the cookie from the browser or localstorage ko frontEnd clear krega
      httpOnly: true, 
      secure: true,
    })

    res.send(success(200,'User Logged Out'))
  } catch (e) {
    res.send(error(500 ,e.message))
  }
}

const deleteController = async (req, res) => {
  const email = req.params.email;

  const user = await User.findOne({ email });
  // console.log(user);

  if (!user) {
    // return res.status(403).send("User Not Registered");
    return res.send(error(403, "User Not Registered"));
  }

  await user.deleteOne();

  // res.status(200).send(user);
  res.send(success(200, user));
};

const refreshAccessTokenController = async (req, res) => {
  // const { refreshToken } = req.body;
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    // return res.status(401).send("Refresh Token is required");
    return res.send(error(401, "Refresh Token is required"));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    console.log(decoded);
    const id = decoded.id;
    const accessToken = generateAccessToken({ id });

    // return res.status(201).json({ accessToken });
    return res.send(success(201,{accessToken}))
  } catch (error) {
    console.log(error);
    // return res.status(401).send("Invalid Refresh token");
    return res.send(error(401, "Invalid Refresh token"));
  }
};

//Internal Functions
const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: "20m",
  });
  // console.log('AccessToken:',token);
  return token;
};

const generateRefreshToken = (data) => {
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: "1y",
  });
  // console.log('AccessToken:',token);
  return token;
};

module.exports = {
  loginController,
  signupController,
  deleteController,
  refreshAccessTokenController,
  logoutController
};
