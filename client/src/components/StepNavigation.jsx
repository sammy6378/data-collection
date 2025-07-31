import { useFormContext, useFormState, useWatch } from "react-hook-form";


export default function StepNavigation({
  currentStep,
  steps,
  stepFields,
  onPrev,
  onNext,
  isLastStep,
  isSubmitting, // ✅ NEW prop
}) {
  const { control, getValues, trigger } = useFormContext();
  const watchedValues = useWatch({ control });
  const { errors } = useFormState({ control });

  const isStepValid = () => {
    const fieldsToCheck = stepFields[currentStep];

    return fieldsToCheck.every((field) => {
      const value = getValues(field);

      if (field === "cv") {
        return value?.[0] instanceof File;
      }

      if (field === "experienceSummary") {
        return typeof value === "string" && value.trim().length > 0;
      }

      if (Array.isArray(value)) {
        return (
          value.length > 0 &&
          value.every((item) => item?.organization && item?.years)
        );
      }

      return value !== undefined && value !== null && value !== "";
    });
  };

  const handleNextClick = async () => {
    const valid = await trigger(stepFields[currentStep]);
    if (valid) onNext();
  };

  return (
    <div className="flex justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 0}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50"
      >
        Previous
      </button>

      {!isLastStep ? (
        <button
          type="button"
          onClick={handleNextClick}
          disabled={!isStepValid()}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            isStepValid()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      )}
    </div>
  );
}
