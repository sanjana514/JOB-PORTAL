import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import {
  applyJob,
  getApplicantcount,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/:id/count").get(isAuthenticated, getApplicantcount);

export default router;
