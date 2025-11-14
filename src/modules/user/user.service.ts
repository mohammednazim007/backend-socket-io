import User from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================================================
// ✅ METHOD: POST
// ✅ SERVICE: createUser
// PURPOSE:
//    - Create a new user with name, email, password, and optional avatar.
// CONTROLLER:
//    - Called by `register` in `user.controller.ts` to register a new user.
// ============================================================
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

// ============================================================
// ✅ METHOD: POST
// ✅ SERVICE: loginUser
// PURPOSE:
//    - Authenticate user with email and password, and return JWT token.
// CONTROLLER:
//    - Called by `login` in `user.controller.ts` to log in a user.
// ============================================================
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "30d" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "30d" }
  );

  //✅ Update user last active timestamp
  user.lastActive = new Date();
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  return { accessToken, refreshToken, user: userObj };
};

// ============================================================
// ✅ METHOD: POST
// ✅ SERVICE: updateProfile
// PURPOSE:
//    - Update user's profile data: name, password, and optional avatar.
// PARAMS:
//    - `file`: uploaded profile image (optional)
//    - `currentPassword`, `newPassword`: for password change (optional)
//    - `name`: updated name (optional)
// CONTROLLER:
//    - Called by `updateUserProfile` in `user.controller.ts`
// ============================================================
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

  if (name) user.name = name;

  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Current password is incorrect");
    user.password = await bcrypt.hash(newPassword, 10);
  }

  if (file?.path) user.avatar = file.path;

  await user.save();
  return user;
};

// ============================================================
// ✅ METHOD: GET
// ✅ SERVICE: getCurrentUser
// PURPOSE:
//    - Fetch the current user by ID, excluding password.
// CONTROLLER:
//    - Called by `getCurrent` in `user.controller.ts`
// ============================================================
export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};
