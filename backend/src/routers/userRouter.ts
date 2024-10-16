import express from "express";
import userController from "../controller/user-Controller";

export const userRouter = express.Router();
// POST /api/users/signin
userRouter.post("/signin", userController.userSignIn);

// post /api/users/signup
userRouter.post("/signup", userController.userSignUp);

userRouter.get("/", userController.getUsers);

userRouter.post("/createuser", userController.createUser);

userRouter.delete("/user/:id", userController.deleteUser);
