import User from "../models/User.js";

export async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

export async function findUserByEmail(email) {
  return await User.findOne({ email });
}

export async function findUserByEmailWithPassword(email) {
  return await User.findOne({ email }).select("+passwordHash");
}

export async function findUserById(id) {
  return await User.findById(id).select("-passwordHash");
}