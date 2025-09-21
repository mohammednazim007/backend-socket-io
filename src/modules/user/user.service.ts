import User from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ** Create User with name, email and password
export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User with this email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};

// ** Login User with email and password
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  return { token, user };
};

// ** Get all Friends
export const getCurrentRelatedFriends = async (userId: string) => {
  const friends = await User.aggregate([
    {
      $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
    },
    {
      $project: {
        __v: 0,
        password: 0,
      },
    },
  ]);

  if (!friends) throw new Error("Friend is not found");

  return friends;
};

//** profile image upload service
export const updateUserProfileImage = async (
  userId: string,
  name: string,
  profileUrl: string
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name, profileUrl },
    { new: true }
  );
  if (!user) throw new Error("User not found");

  return user;
};

// ** get the current user by id
export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) throw new Error("User not found");

  return user;
};
