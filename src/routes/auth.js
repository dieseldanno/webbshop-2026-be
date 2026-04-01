import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  validateRegister,
  validateLogin,
  validateAuthResult,
} from "../middleware/authValidation.js";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../db/users.js";
const router = Router();

router.post(
  "/register",
  validateRegister,
  validateAuthResult,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const user = await createUser({ name, email, passwordHash: password });
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  }
);

router.post(
  "/login",
  validateLogin,
  validateAuthResult,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await findUserByEmailWithPassword(email);

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isPasswordCorrect = await user.isSamePassword(password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

export default router;
