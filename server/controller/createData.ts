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
      dataConsent,
      cvFile,
    } = req.body as Data;

    // Debug: Log the dataConsent value
    console.log('DataConsent received:', dataConsent, typeof dataConsent);

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
      !cvFile ||
      !dataConsent
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided and consent must be given",
        });
    }

    // Validate each experience entry has required fields (backward compatible)
    for (const exp of experienceList) {
      if (!exp.organization || !exp.years) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Organization and years are required for each experience entry",
          });
      }
      // New fields (positionHeld, contributions) are optional for backward compatibility
    }

    // Create a new data entry
        const newData = new DataModel({
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
      experienceList,
      experienceSummary,
      cvFile,
      dataConsent: Boolean(dataConsent), // Ensure it's a boolean
    });

    // Save the data to database
    const saved = await newData.save();
    
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
