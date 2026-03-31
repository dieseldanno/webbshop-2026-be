import { describe, it, expect, beforeEach } from "vitest";
import { clearDatabase } from "../setup.js";
import User from "../../src/models/User.js";

describe("User model", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("should create a new user", async () => {
    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash: "password",
    });
    await user.save();
    expect(user).toBeDefined();
    expect(user.email).toBe("john.doe@example.com");
  });

  it("should hash the password before saving", async () => {
    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash: "password",
    });
    await user.save();
    expect(user.passwordHash).not.toBe("password");
  });
});