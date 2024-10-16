import { Request, Response } from "express";
import { User, UserModel } from "../models/userModel";
import { generateToken } from "../utils";
import bcrypt from "bcryptjs";

// const allProducts = async (req: Request, res: Response) => {
//   try {
//     const products = await ProductModel.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// };
const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find();

    if (!users.length) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    console.log(users.length);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      role: req.body.role,
    } as User);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// New function to delete a user
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id; // Get the user ID from the URL parameters

  try {
    const user = await UserModel.findByIdAndDelete(userId); // Delete user by ID

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const userController = {
  userSignIn,
  userSignUp,
  getUsers,
  createUser,
  deleteUser,
};

export default userController;
