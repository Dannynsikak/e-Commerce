import express, { Request, Response } from "express";
import { User, UserModel } from "../models/userModel";
import { generateToken } from "../utils";
import bcrypt from "bcryptjs";

const userSignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
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
};

const userSignUp = async (req: Request, res: Response) => {
  const defaultRole = "user";

  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    role: defaultRole,
  } as User);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  });
};

const userController = {
  userSignIn,
  userSignUp,
};

export default userController;
