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

const userController = {
  userSignIn,
  userSignUp,
  getUsers,
};

export default userController;
