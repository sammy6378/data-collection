// src/utils/validationRules.js

// === Text Validators ===
export const textRequired = (label = "This field") => ({
  required: `${label} is required`,
  minLength: {
    value: 2,
    message: `${label} must be at least 2 characters`,
  },
  maxLength: {
    value: 100,
    message: `${label} must be less than 100 characters`,
  },
});

// Text validator that accepts "N/A" as valid
export const textRequiredOrNA = (label = "This field") => ({
  required: `${label} is required`,
  validate: {
    minLengthOrNA: (value) => {
      if (value && (value.toLowerCase() === "n/a" || value.toLowerCase() === "na")) {
        return true;
      }
      return value && value.length >= 2 || `${label} must be at least 2 characters or "N/A"`;
    }
  },
  maxLength: {
    value: 100,
    message: `${label} must be less than 100 characters`,
  },
});

export const selectRequired = (label = "Selection") => ({
  required: `Please select a ${label.toLowerCase()}`,
});

export const textareaOptional = (label = "Field", max = 500) => ({
  maxLength: {
    value: max,
    message: `${label} must be less than ${max} characters`,
  },
});

export const textareaRequired = (label = "Field", min = 10, max = 1000) => ({
  required: `${label} is required`,
  minLength: {
    value: min,
    message: `${label} must be at least ${min} characters`,
  },
  maxLength: {
    value: max,
    message: `${label} must be less than ${max} characters`,
  },
});

// Textarea validator that accepts "N/A" as valid
export const textareaRequiredOrNA = (label = "Field", min = 10, max = 1000) => ({
  required: `${label} is required`,
  validate: {
    minLengthOrNA: (value) => {
      if (value && (value.toLowerCase() === "n/a" || value.toLowerCase() === "na")) {
        return true;
      }
      return value && value.length >= min || `${label} must be at least ${min} characters or "N/A"`;
    }
  },
  maxLength: {
    value: max,
    message: `${label} must be less than ${max} characters`,
  },
});

export const fileValidation = {
  required: "Please upload your CV",
  validate: {
    lessThan5MB: (files) =>
      files?.[0]?.size < 5 * 1024 * 1024 || "File must be under 5MB",
  },
};

// === Grouped Schema for Personal Info Section ===
export const personalInfoValidation = {
  name: textRequired("Name"),
  jobTitle: textRequired("Job Title"),
  jobType: selectRequired("Job Type"),
  supervisor: textRequired("Supervisor"),
  department: textRequired("Department"),
  section: textRequired("Section"),
  school: {},
  location: {},
  country: {},
};


// === Grouped Schema for Education Section ===
export const educationValidation = {
  educationLevel: selectRequired("Education level"),
  qualifications: textareaOptional("Qualifications", 500),
  otherEducation: textareaOptional("Other education", 300),
  otherSkills: textareaOptional("Other skills", 500),
};

// === Grouped Schema for Experience Section ===
export const experienceValidation = {
  organization: textRequiredOrNA("Organization"),
  positionHeld: textRequiredOrNA("Position Held"),
  years: textRequiredOrNA("Duration"),
  contributions: textareaRequiredOrNA("Contributions", 3, 500),
};

