import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri";
import cloudinary from "../utils/cloudinary";
import { Request, Response } from "express";
import { parseRequirements } from "../utils/job.utils";
import { generateAuthToken } from "../utils/auth.utils";

interface RequestWithId extends Request {
  id?: string;
}

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const file = req.file;
    let cloudResponse = null;

    if (file) {
      const fileUri = getDataUri(file);
      if (!fileUri.content) {
        return res.status(400).json({
          message: "File content is missing",
          success: false,
        });
      }
      cloudResponse = await cloudinary.uploader.upload(fileUri.content,
        { resource_type: "auto" }
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse?.secure_url || undefined,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }
    const token = generateAuthToken(user._id.toString());

    user.token = token;

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .cookie("userId", user._id.toString(), {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: user.toObject(),
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Logout Error:", error); // Log the error
    return res.status(500).json({
      message: "Could not log out",
      success: false,
    });
  }
};

export const updateProfile = async (
  req: RequestWithId,
  res: Response
): Promise<any> => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    // make file optional
    const file = req.file;
    // Cloudinary
    let cloudResponse = null;
    if (file) {
      const fileUri = getDataUri(file);
      if (!fileUri.content) {
        return res.status(400).json({
          message: "File content is missing",
          success: false,
        });
      }
      cloudResponse = await cloudinary.uploader.upload(fileUri.content,
        { resource_type: "auto" }
      );
    }

    const skillsArray = parseRequirements(skills);

    const userId = req.cookies.userId; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) {
      if (!user.profile) {
        user.profile = {
          skills: [],
          profilePhoto: "",
        };
      }
      user.profile.bio = bio;
    }
    if (skills) {
      if (!user.profile) {
        user.profile = {
          skills: [],
          profilePhoto: "",
        };
      }
      user.profile.skills = skillsArray;
    }

    if (cloudResponse) {
      if (!user.profile) {
        user.profile = {
          skills: [],
          profilePhoto: "",
        };
      }
      user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname; // Save the original file name
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: user.toObject(),
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
