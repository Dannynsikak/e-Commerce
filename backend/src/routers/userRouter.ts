import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/userModel";
import { generateToken } from "../utils";
import bcrypt from "bcryptjs";

export const userRouter = express.Router();
// POST /api/users/signin
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).json({ message: "Invalid email or password" });
  })
);
