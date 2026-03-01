import express from "express";
import pg from "pg";
import db from "./db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const app = express();
const saltRounds = process.env.SALT_ROUNDS;

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Aaalu le lo" });
});

app.post(
  "/signup",
  async (req, res, next) => {
    if (!(req.body.email && req.body.password && req.body.type)) {
      return res
        .status(400)
        .json({ message: "Invalid Post Request credentials..." });
    }
    const { email } = req.body;
    try {
      const response = await db.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email]
      );
      if (response.rows.length == 0) {
        next();
      } else {
        return res.status(409).json({
          message: "Some user with the provided email already exists...",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  async (req, res) => {
    const body = req.body;
    const { email, password, type } = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      const response = await db.query(
        "INSERT INTO users(user_email, user_password, user_type) VALUES ($1,$2,$3)",
        [email, hashedPassword, type]
      );
      res.status(200).json({ message: "User Signup Successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

app.post(
  "/login",
  async (req, res, next) => {
    if (!(req.body.email && req.body.password)) {
      return res
        .status(400)
        .json({ message: "Invalid Post Request credentials..." });
    }
    const { email } = req.body;
    try {
      const response = await db.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email]
      );
      if (response.rows.length == 1) {
        next();
      } else {
        return res.status(401).json({
          message:
            "The email is not Registered please Signup with your email first...",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  async (req, res) => {
    const body = req.body;
    const { email, password } = body;
    try {
      const result = await db.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email]
      );
      const hashedPassword = result.rows[0].user_password;
      const isMatching = await bcrypt.compare(password, hashedPassword);
      if (isMatching) {
        res.status(200).json({ message: "User login successful" });
      } else {
        res.status(401).json({ message: "Invalid Login Credentials..." });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server is live ...");
});
