const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect");
const allRouter = require("./routes/");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;

dotenv.config({
  path: "./.env",
});



cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY 
});
const app = express();

app.use(express.json(
  {
    limit: '50mb'
  }
));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
  );
  
  const PORT = process.env.PORT || 4001;
app.use("/api", allRouter);
app.get("/", (req, res) => {
  res.status(200).send("Ok from Server");
});

dbConnect();

app.listen(PORT, () => {
  console.log("Listening on Port", PORT);
});
