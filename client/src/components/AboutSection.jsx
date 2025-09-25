import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AboutSection() {
  const steps = [
    "Fill your personal and job details",
    "Add education and experience",
    "Upload your current CV",
    "Submit the form",
  ];

  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!consent) {
      setShowConsentError(true);
      return;
    }
    setShowConsentError(false);
    setLoading(true);
    // Store consent in sessionStorage for form access
    sessionStorage.setItem("dataConsent", "true");
    setTimeout(() => {
      navigate("/form");
    }, 1200); // Adjust delay as needed
  };

  return (
    <section className="text-gray-800 py-10 px-6 relative">
      {/* Full-screen loader */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-10 w-10 text-green-800"
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
            <p className="text-green-700 font-medium text-lg">
              Loading form...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-12">How It Works</h2>

        {/* Desktop */}
        <div className="hidden md:flex justify-between items-start relative mb-16 max-w-4xl mx-auto">
          <div className="absolute top-6 left-0 w-full h-1 bg-green-200 z-0"></div>
          {steps.map((text, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center w-1/4"
            >
              <div className="w-12 h-12 bg-green-800 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
                {index + 1}
              </div>
              <p className="text-base font-medium text-gray-800">{text}</p>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="relative flex flex-col md:hidden items-start gap-10 mb-16 pl-4">
          <div className="absolute top-0 left-6 h-full w-1 bg-green-200 z-0"></div>
          {steps.map((text, index) => (
            <div key={index} className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-base">
                {index + 1}
              </div>
              <p className="text-base font-medium text-gray-800 max-w-xs">
                {text}
              </p>
            </div>
          ))}
        </div>

        <p className="text-gray-700 text-lg mb-8">
          Filling the form takes less than 10 minutes.
        </p>

        {/* Data Protection and Consent Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Data Protection and Consent
          </h3>
          <div className="max-h-48 overflow-y-auto text-gray-700 text-sm mb-4 p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="mb-3">
              All personal data, as defined under the{" "}
              <strong>Data Protection Act, 2019</strong>, collected by the
              Employer through this tool shall be processed lawfully, fairly,
              and transparently, and in accordance with the provisions of the
              Act. The data will be used for purposes relating to your
              employment, including the update and maintenance of accurate
              employment records, and will be retained only for as long as is
              necessary for those purposes.
            </p>
            <p className="mb-3">
              Processing of your personal data is based on the necessity to
              perform your employment contract, and the Employer's legitimate
              interests. The data may be accessed by the Employer and its
              authorised service providers for employment-related purposes only,
              subject to appropriate safeguards.
            </p>
            <p>
              By checking this box, you acknowledge that you have been informed
              of the purpose of this data collection, and you consent to the
              collection and lawful processing of your personal data as outlined
              above. You further retain your rights under the Act, including the
              right to access, correction, objection, and withdrawal of consent,
              subject to the Employer's contractual and statutory obligations.
            </p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) setShowConsentError(false);
              }}
              className="mt-1 accent-green-700 scale-110"
            />
            <span className="text-gray-800 text-sm leading-relaxed group-hover:text-gray-900 transition-colors">
              I have read and understand the data protection terms above, and I
              consent to the collection and processing of my personal data as
              outlined.
            </span>
          </label>
          {showConsentError && (
            <p className="text-red-600 text-sm mt-2 ml-7">
              You must provide consent to proceed with the form.
            </p>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-full shadow-md transition disabled:opacity-50 ${
            consent
              ? "bg-green-800 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="h-16 w-16 text-green-800"
                style={{ animation: "spin 1.2s linear infinite" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 50 50"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              Loading...
            </>
          ) : (
            "Get Started"
          )}
        </button>
      </div>
    </section>
  );
}
