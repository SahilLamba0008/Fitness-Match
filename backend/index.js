const PORT = 8000;
const express = require("express");
const { MongoClient } = require("mongodb");
const { v1: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const uri = process.env.URI;

const app = express();
app.use(cors()); //cross-origin middleware
app.use(express.json()); //read json middleware

app.get("/", (req, res) => {
  res.json("Hello");
});

/*----------- User Registration Route -----------*/
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  const generatedUserId = uuidv4();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await client.connect();
    const database = client.db("FitnessMatch-app-data");
    const users = database.collection("users");
    console.log(req.body);

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists. Please login");
    }

    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };

    const secret = "SahilLamba";
    const token = jwt.sign(data, secret, {
      expiresIn: 60 * 12,
    });

    const insertedUser = await users.insertOne(data);

    res.status(201);
    res.json({ token, userId: generatedUserId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating a user" });
  }
});

/*-----------  User Login Route -----------*/
app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("FitnessMatch-app-data");
    const users = database.collection("users");

    const user = await users.findOne({ email });
    const correctPassword = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (user && correctPassword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 12,
      });

      res.status(201).json({ token, userId: user.user_id });
    }
    res.status(400).send("Invalid Email or Password");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

/*----------- Update User Route -----------*/
app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  console.log("form data : ", formData);

  try {
    await client.connect;
    const database = client.db("FitnessMatch-app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        gender_identity: formData.gender_identity,
        url: formData.url,
        about: formData.about,
        matches: formData.matches,
      },
    };

    const insertedUser = await users.updateOne(query, updateDocument);
    res.send(insertedUser);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

/*----------- Get User Route -----------*/
app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;
  console.log("userId : ", userId);

  try {
    await client.connect();
    const database = client.db("FitnessMatch-app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const user = await users.findOne(query);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error while fetching user data" });
  } finally {
    await client.close();
  }
});

/*----------- Get all Users Route -----------*/
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("FitnessMatch-app-data");
    const users = database.collection("users");

    const returnedUsers = await users.find().toArray();
    res.json(returnedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  } finally {
    await client.close();
  }
});

/*----------- Get Matched Users Route -----------*/
app.get("/matchedusers", async (req, res) => {
  const client = new MongoClient(uri);

  const userIds = JSON.parse(req.query.userIds);

  try {
    await client.connect();
    const database = client.db("FitnessMatch-app-data");
    const users = database.collection("users");

    const matchedUsers = await users
      .find({ user_id: { $in: userIds } })
      .toArray();

    res.json(matchedUsers);
  } catch (error) {
    console.error("Error fetching matched users:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching matched users" });
  } finally {
    await client.close();
  }
});

/*----------- Add User Matches Route -----------*/
app.put("/addmatch", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, matchedUserId } = req.body;
  try {
    await client.connect();
    const database = client.db("FitnessMatch-app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const updateDocument = {
      $push: { matches: { user_id: matchedUserId } },
    };

    const user = await users.updateOne(query, updateDocument);
    res.send(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding users matches " });
  } finally {
    await client.close();
  }
});

/*----------- Get User Messages Route -----------*/
app.get("/messages", async (req, res) => {
  const { userId, correspondingUserId } = req.query;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("FitnessMatch-app-data");
    const messages = database.collection("messages");

    const query = {
      from_userId: userId,
      to_userId: correspondingUserId,
    };
    const foundMessages = await messages.find(query).toArray();
    res.send(foundMessages);
  } finally {
    await client.close();
  }
});

/*----------- Add User Messages to DB Route -----------*/
app.post("/message", async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db("FitnessMatch-app-data");
    const messages = database.collection("messages");

    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
