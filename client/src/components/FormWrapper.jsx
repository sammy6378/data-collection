import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInfoSection from "./PersonalInfoSection";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import FileUploadSection from "./FileUploadSection";
import StepNavigation from "./StepNavigation";

const steps = ["Personal", "Education", "Experience", "Upload CV"];

export default function FormWrapper() {
  const navigate = useNavigate();
  const methods = useForm();
  const { handleSubmit, watch, setValue, trigger } = methods;

  const stepFields = [
    [
      "name",
      "jobTitle",
      "jobType",
      "supervisor",
      "department",
      "section",
      // "school",
      // "location",
      // "country",
    ],
    ["educationLevel"],
    ["experienceList"],
    ["cv", "dataConsent"],
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });
  const isLastStep = currentStep === steps.length - 1;
  const url = import.meta.env.VITE_API_URL;
  // console.log("API URL:", url);

  const showModal = (title, message, type = "info") => {
    setModal({ open: true, title, message, type });
  };
  const closeModal = () => {
    setModal({ ...modal, open: false });
    if (modal.type === "success") {
      methods.reset();
      navigate("/");
    }
  };

  const onSubmit = async (data) => {
    // console.log("Form data before submission:", data);
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
      experienceSummary: "", // Send empty string for now, backend still expects it
      cvFile: data.cvFile || "",
      dataConsent: data.dataConsent || false,
    };
    // console.log("JSON data to submit:", jsonData);
    setIsSubmitting(true);
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
        showModal("Server Error", "Server returned invalid response", "error");
        return;
      }
      if (!res.ok) {
        console.error("❌ Server error:", json);
        if (json.errors) {
          const messages = Object.values(json.errors).join("<br/>");
          showModal(
            "Submission Failed",
            `Failed to save your data, try again:<br/>${messages}`,
            "error"
          );
        } else {
          showModal(
            "Submission Failed",
            `Failed to save your data, try again: ${
              json?.message || json?.error || "Unknown error"
            }`,
            "error"
          );
        }
        return;
      }
      // console.log("✅ Success:", json);
      showModal(
        "Success",
        "Your data has been saved successfully. Thank You!",
        "success"
      );
      // Optionally reset the form or redirect
      // methods.reset();
    } catch (err) {
      console.error("❌ Network error:", err);
      showModal(
        "Network Error",
        "Network error occurred. Please check your connection and try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
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
                  currentStep === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-2 text-sm ${
                  currentStep === index
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500"
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
          <FileUploadSection watch={watch} setValue={setValue} />
        )}

        {/* Navigation */}
        <StepNavigation
          currentStep={currentStep}
          steps={steps}
          stepFields={stepFields}
          isLastStep={isLastStep}
          onPrev={prevStep}
          onNext={nextStep}
          isSubmitting={isSubmitting}
        />
      </form>
      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/70 via-teal-900/60 to-indigo-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <h3
              className={`text-xl font-bold mb-2 ${
                modal.type === "success"
                  ? "text-green-600"
                  : modal.type === "error"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {modal.title}
            </h3>
            <div
              className="mb-4 text-gray-700"
              dangerouslySetInnerHTML={{ __html: modal.message }}
            />
            <button
              onClick={closeModal}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </FormProvider>
  );
}
