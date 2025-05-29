import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJobById,
  deleteJobById,
} from "../controllers/job.controller";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/update/:id").put(isAuthenticated, updateJobById);
router.route("/delete/:id").delete(isAuthenticated, deleteJobById);

export default router;
