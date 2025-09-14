import { Request, Response } from "express";
import { Data, DataModel } from "../model/data";

// craete form data
export const createData = async (req: Request, res: Response) => {
  try {
    // console.log("Request body:", req.body);
    // console.log("Request headers:", req.headers);

    if (!req.body) {
      return res
        .status(400)
        .json({ success: false, message: "Request body is missing" });
    }

    const {
      name,
      jobTitle,
      jobType,
      supervisor,
      department,
      section,
      location,
      country,
      school,
      educationLevel,
      qualifications, // optional
      otherEducation, // optional
      otherSkills,
      experienceSummary,
      experienceList,
      cvFile,
    } = req.body as Data;

    // Validate required fields
    if (
      !name ||
      !jobTitle ||
      !jobType ||
      !supervisor ||
      !department ||
      !section ||
      !educationLevel ||
      !experienceList ||
      !experienceList.length ||
      !cvFile
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided",
        });
    }

    // Validate each experience entry has required fields
    for (const exp of experienceList) {
      if (!exp.organization || !exp.positionHeld || !exp.years || !exp.contributions) {
        return res
          .status(400)
          .json({
            success: false,
            message: "All experience fields (organization, position, years, contributions) are required",
          });
      }
    }

    // Create a new data entry
    const saved = await DataModel.create({
      name,
      jobTitle,
      jobType,
      supervisor,
      department,
      section,
      location,
      country,
      school,
      educationLevel,
      qualifications,
      otherEducation,
      otherSkills,
      experienceSummary,
      experienceList,
      cvFile,
    });
    res.status(201).json({
      success: true,
      message: "Data created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get data submissions
export const getData = async (req: Request, res: Response) => {
  try {
    const data = await DataModel.find();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
