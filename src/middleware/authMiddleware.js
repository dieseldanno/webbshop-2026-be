import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No header
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Format: "Bearer token"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};