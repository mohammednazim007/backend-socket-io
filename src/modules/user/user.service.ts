import User from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ** Create User with name, email and password
export const createUser = async (
  name: string,
  email: string,
  password: string,
  avatar: string
) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User with this email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    avatar: "",
    password: hashedPassword,
  });

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

  // Convert Mongoose document to plain object
  const userObj = user.toObject();
  delete userObj.password; // remove password

  return { token, user: userObj };
};

// ** Get all Friends
export const getCurrentRelatedFriends = async (userId: string) => {
  const friends = await User.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(userId) },
        friends: { $in: [userId] },
      },
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
export const updateProfile = async (
  userId: string,
  file?: Express.Multer.File & { path?: string; filename?: string },
  currentPassword?: string,
  newPassword?: string,
  name?: string
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Update name
  if (name) {
    user.name = name;
  }

  // Handle password update if currentPassword + newPassword are provided
  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  // Handle avatar upload
  if (file?.path) {
    user.avatar = file.path; // could be Cloudinary URL if uploaded before
  }

  await user.save();

  return user;
};

// ** get the current user by id
export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) throw new Error("User not found");

  return user;
};
