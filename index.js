const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || 80;
dotenv.config();
const express = require("express");
const app = express();
app.use(express.json());

const user = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

let User = mongoose.model("User", user, "users");

// Create User
app.get("/create/:name", async (req, res) => {
  const name = req.params.name ?? faker.name.fullName();
  const user = new User({
    name: name,
    email: faker.internet.email(),
    password: faker.internet.password(),
  });
  await user.save();
  res.send(user);
});

// List Users
app.get("/list", async (req, res) => {
  const users = await User.find();
  res.send(
    users.map((user) => {
      return { name: user.name, email: user.email };
    })
  );
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server started on port http://localhost:${port}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
