import express from "express";
import userController from "../controller/user-Controller";
import { isAuth } from "../utils";

export const userRouter = express.Router();
// POST /api/users/signin
userRouter.post("/signin", userController.userSignIn);

// post /api/users/signup
userRouter.post("/signup", userController.userSignUp);

userRouter.get("/", userController.getUsers);

userRouter.post("/createuser", isAuth, userController.createUser);

userRouter.delete("/:id", isAuth, userController.deleteUser);
