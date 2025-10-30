import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
};
