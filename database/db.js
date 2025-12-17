const mongoose = require("mongoose");

const connectTODB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Faild To connent", error);
    process.exit(1);
  }
};

module.exports = connectTODB;
