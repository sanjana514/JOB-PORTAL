import { Job } from "../models/job.model";
import { Application } from "../models/application.model";
import { Request, Response } from "express";
import { parseRequirements } from "../utils/job.utils";
import mongoose, { Document } from "mongoose";

interface IJob extends Document {
  applications?: mongoose.Types.ObjectId[];
  [key: string]: any;
}

interface IApplication {
  _id: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

// Define interfaces for the plain objects (after .lean())
interface IJobLean {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  requirements: string[];
  salary: number;
  experienceLevel: number;
  location: string;
  jobType: string;
  position: number;
  company: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
  applications: mongoose.Types.ObjectId[] | IApplicationLean[];
  createdAt: Date;
  updatedAt: Date;
}

interface IApplicationLean {
  _id: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

interface RequestWithId extends Request {
  id?: string;
}

export const postJob = async (
  req: RequestWithId,
  res: Response
): Promise<any> => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    // console.log(req);
    // user id will be taken from the token
    const userId = req.cookies.userId;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Please fill all the fields.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: parseRequirements(requirements),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error while posting job", success: false });
  }
};

export const getAllJobs = async (req: Request, res: Response): Promise<any> => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error while fetching jobs", success: false });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<any> => {
  try {
    const jobId = req.params.id;

    // Debug logging
    console.log("getJobById request:", {
      jobId,
      headers: req.headers,
      cookies: req.cookies,
      url: req.url
    });

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      console.log("Invalid ObjectId format:", jobId);
      return res.status(400).json({
        message: "Invalid job ID format",
        success: false,
      });
    }

    // First get the job without population
    const job = await Job.findById(jobId).lean() as IJobLean;

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Then populate applications separately with error handling
    try {
      if (job.applications && job.applications.length > 0) {
        const populatedApplications = await Application.find({
          _id: { $in: job.applications }
        }).lean() as IApplicationLean[];

        job.applications = populatedApplications;
      }
    } catch (populateError) {
      console.error("Error populating applications:", populateError);
      // Don't fail the whole request, just return the job without populated applications
      job.applications = [];
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error("Error in getJobById:", {
      jobId: req.params.id,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return res.status(500).json({
      message: "Internal server error while fetching job details",
      success: false,
    });
  }
};

export const getAdminJobs = async (
  req: RequestWithId,
  res: Response
): Promise<any> => {
  try {
    const adminId = req.cookies.userId;
    const jobs = await Job.find({ created_by: adminId })
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


export const updateJobById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience, // frontend sends this
      position,
      companyId,
    } = req.body;

    const updatedFields: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(requirements && { requirements: parseRequirements(requirements) }),
      ...(salary && { salary: Number(salary) }),
      ...(location && { location }),
      ...(jobType && { jobType }),
      ...(experience && { experienceLevel: experience }),
      ...(position && { position }),
      ...(companyId && { company: companyId }),
    };

    const job = await Job.findByIdAndUpdate(jobId, updatedFields, {
      new: true,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job updated successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while updating job.",
      success: false,
    });
  }
};



export const deleteJobById = async (req: Request, res: Response): Promise<any> => {
  try {
    const jobId = req.params.id;

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job deleted successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      message: "Server error while deleting job.",
      success: false,
    });
  }
};
