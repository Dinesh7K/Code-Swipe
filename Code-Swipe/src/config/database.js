const moongoose = require("mongoose");

const connectDB = async () => {
  await moongoose.connect(
    "mongodb+srv://kdinesh04032002:P4frKTm4qH4wGBn0@projectnodejs.p9uxr.mongodb.net/Code-Swipe"
  );
};

module.exports = connectDB;
