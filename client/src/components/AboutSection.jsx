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
  const navigate = useNavigate();

  const handleStart = () => {
    setLoading(true);
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

        <p className="text-gray-700 text-lg mb-6">
          Filling the form takes less than 10 minutes.
        </p>

        <button
          onClick={handleStart}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-green-800 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-green-700 transition disabled:opacity-50"
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
        {/* Large Centered Logo Below */}
        <div className="w-full flex justify-center mt-16">
          <img
            src="/images/logo-below-image.png"
            alt="Logo Below"
            className="w-64 md:w-96 lg:w-[32rem] object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
