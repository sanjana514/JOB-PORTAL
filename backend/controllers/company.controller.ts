import { Company } from "../models/company.model";
import getDataUri from "../utils/datauri";
import cloudinary from "../utils/cloudinary";
import { Request, Response } from "express";

interface RequestWithId extends Request {
  id?: string;
}

export const registerCompany = async (
  req: RequestWithId,
  res: Response
): Promise<any> => {
  //create company
  try {
    const { companyName } = req.body;
    // take user id from token in appplication used for authentication, used JWT token
    const userId = req.cookies.userId;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register same company.",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: userId,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCompany = async (
  req: RequestWithId,
  res: Response
): Promise<any> => {
  try {
    const userId = req.cookies.userId;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, description, website, location } = req.body;

    const file = req.file;
    // Cloudinary upload
    const fileUri = getDataUri(file);
    if (!fileUri.content) {
      return res.status(400).json({
        message: "File content is required.",
        success: false,
      });
    }
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    const updateData = { name, description, website, location, logo };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company information updated.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
