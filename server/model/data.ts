import mongoose from "mongoose";

export enum Type {
    PERMANENT = "Permanent",
    CONTRACTUAL = "Contractual",
    INTERN = "Intern",
    VOLUNTEER = "Volunteer",
}
export enum Level {
    HSO = "High School Only",
    HSC = "High School + College Diploma/Professional Qualification",
    BACHELOR = "Bachelor’s Degree",
    BACHELOR_HONORS = "Bachelor’s + Additional Diploma/Professional Qualification",
    MASTERS = "Master’s Qualification",
    MASTERS_HONORS = "Master’s + Diploma/Professional Qualification",
    PHD = "PhD",
    PHD_HONORS = "PhD + Diploma/Professional Qualification",
}

export enum Experience {
    ONE_TO_TWO_YEARS = "1–2 years",
    THREE_TO_FOUR_YEARS = "3–4 years",
    FIVE_TO_SIX_YEARS = "5–6 years",
    SEVEN_TO_EIGHT_YEARS = "7–8 years",
    NINE_TO_TEN_YEARS = "9–10 years",
    ELEVEN_TO_TWELVE_YEARS = "11–12 years",
    ABOVE_THIRTEEN_YEARS = "Above 13 years",
}


export interface Data {
  name: string;
  jobTitle: string;
  jobType: Type;
  supervisor: string;
  department: string;
  section: string;
  location?: string;
  country?: string;
  school?: string;
  educationLevel: Level;
  experienceList: {
    organization: string;
    years: Experience;
  }[];
    experienceSummary: string;
  otherEducation?: string;
  otherSkills?: string;
  qualifications?: string;
  cvFile: string;
}


const dataSchema = new mongoose.Schema<Data>({
    name: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobType: { type: String, enum: Object.values(Type), required: true },
    supervisor: { type: String, required: true },
    department: { type: String, required: true },
    section: { type: String, required: true },
    location: { type: String, required: false },
    country: { type: String, required: false },
    school: { type: String, required: false },
    
    // section 2
    educationLevel: { type: String, enum: Object.values(Level), required: true },
    experienceList: {
        type: [
            {
                organization: { type: String, required: true },
                years: { type: String, enum: Object.values(Experience), required: true },
            }
        ],
        required: true,
    },
    experienceSummary: { type: String, required: true },
    otherEducation: { type: String, default: "" },
    otherSkills: { type: String, default: "" },
    qualifications: { type: String, default: "" },
    
    // section 4 -cv file
    cvFile: { type: String, required: true }
},{timestamps: true});


// model
export const DataModel = mongoose.model<Data>("Data", dataSchema);