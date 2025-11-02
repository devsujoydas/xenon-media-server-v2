const mongoose = require("mongoose"); 
const { MONGO_URI } = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
 
module.exports = connectDB
