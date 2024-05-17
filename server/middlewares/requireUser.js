//This middleware will check that , is header is provided or not in the request
const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseWrapper");
const userModel = require("../models/userModel");
module.exports = (req, res, next) => {
  //    console.log("response from middleware");
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    // return res.status(401).send("Authorization header is required");
    return res.send(error(406,"Authorization header is required"));
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  //  console.log(token);
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.id = decoded.id;

    const user = userModel.findById(req.id);
    if(!user){
      return res.send(error(404,'User Not Found'));
    }
    next();
  } catch (err) {
    console.log(err);
    console.log("Error from middleware");
    // return res.status(401).send("Invalid Access token");
    return res.send(error(401,"Invalid Access token"));
  }
};
