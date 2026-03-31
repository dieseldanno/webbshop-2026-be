import { Router } from "express";
import { validateRegister, validateAuthResult } from "../middleware/authValidation.js";
import { createUser, findUserByEmail } from "../db/users.js";

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

export default router;
