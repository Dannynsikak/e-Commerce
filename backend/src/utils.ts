import { NextFunction, Request, Response } from "express";
import { User } from "./models/userModel";
import jwt from "jsonwebtoken";

// Function to generate a token for the user
export const generateToken = (user: User): string => {
  if (!user || !user._id) {
    throw new Error("Invalid user data");
  }

  // Generate JWT with user data and secret key
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "somethingsecret", // Use secret key from env or default
    {
      expiresIn: "30d", // Token valid for 30 days
    }
  );
};

// Middleware to verify the token and authorize users
export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split(" ")[1]; // Remove "Bearer " prefix
    try {
      // Verify token using JWT_SECRET
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "somethingsecret"
      );

      req.user = decoded as {
        _id: string;
        name: string;
        email: string;
        role: string;
        token: string;
      };

      next();
    } catch (error) {
      if (error instanceof Error) {
        // Log the error message
        res.status(401).json({ message: "Invalid Token" });
      } else {
        console.error("Unexpected Error", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  } else {
    res.status(401).json({ message: "No Token Provided" });
  }
};
