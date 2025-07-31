import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import PersonalInfoSection from "./PersonalInfoSection";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import FileUploadSection from "./FileUploadSection";
import StepNavigation from "./StepNavigation";


const steps = ["Personal", "Education", "Experience", "Upload CV"];

export default function FormWrapper() {
  const methods = useForm();
  const { handleSubmit, watch, setValue, trigger } = methods;

  const stepFields = [
    ["name", "jobTitle", "jobType", "supervisor", "department", "section", "school", "location", "country"],
    ["educationLevel"],
    ["experienceList", "experienceSummary"],
    ["cv"],
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NEW state
  const isLastStep = currentStep === steps.length - 1;
  const url = import.meta.env.VITE_API_URL;
  const onSubmit = async (data) => {
    console.log("Form data before submission:", data);
    
    // Prepare JSON data for submission
    const jsonData = {
      name: data.name,
      jobTitle: data.jobTitle,
      jobType: data.jobType,
      supervisor: data.supervisor,
      department: data.department,
      section: data.section,
      location: data.location,
      country: data.country,
      school: data.school,
      educationLevel: data.educationLevel,
      qualifications: data.qualifications,
      otherEducation: data.otherEducation,
      otherSkills: data.otherSkills,
      experienceList: data.experienceList,
      experienceSummary: data.experienceSummary,
      cvFile: data.cvFile || "", // This will be the Cloudinary URL
    };

    console.log("JSON data to submit:", jsonData);

    setIsSubmitting(true); // ✅ Start spinner

    try {
      const res = await fetch(`${url}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const text = await res.text();
      let json;

      try {
        json = JSON.parse(text);
      } catch {
        console.error("❌ Response is not valid JSON:", text);
        alert("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        console.error("❌ Server error:", json);
        if (json.errors) {
          const messages = Object.values(json.errors).join("\n");
          alert("Submission failed:\n" + messages);
        } else {
          alert("Submission failed: " + (json?.message || json?.error || "Unknown error"));
        }
        return;
      }

      console.log("✅ Success:", json);
      alert("Form submitted successfully! Your application has been saved.");
      
      // Optionally reset the form or redirect
      // methods.reset();
      
    } catch (err) {
      console.error("❌ Network error:", err);
      alert("Network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false); // ✅ Stop spinner
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((label, index) => (
            <div key={index} className="flex-1 text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep === index ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-2 text-sm ${
                  currentStep === index ? "text-blue-600 font-semibold" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Step Components */}
        {currentStep === 0 && <PersonalInfoSection />}
        {currentStep === 1 && <EducationSection />}
        {currentStep === 2 && <ExperienceSection />}
        {currentStep === 3 && (
          <FileUploadSection
            watch={watch}
            setValue={setValue}
          />
        )}

        {/* Navigation */}
        <StepNavigation
          currentStep={currentStep}
          steps={steps}
          stepFields={stepFields}
          isLastStep={isLastStep}
          onPrev={prevStep}
          onNext={nextStep}
          isSubmitting={isSubmitting} // ✅ pass this to show spinner
        />
      </form>
    </FormProvider>
  );
}
