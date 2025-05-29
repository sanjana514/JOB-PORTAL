import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
import { singleUpload } from "../middlewares/mutler";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);

export default router;
