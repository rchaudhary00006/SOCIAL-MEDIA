const mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");

module.exports = async () => {
  const password = "p5U1fbde3V20cvgv";
  const mongoUri = `mongodb+srv://rahul:${password}@cluster0.4zzohmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose
    .connect(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    .then(() => {
      console.log("mongoose Connected");
    })
    
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  
};
