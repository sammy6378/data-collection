import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setLoading(true);

    // Simulate delay or fetch prep before routing
    setTimeout(() => {
      navigate("/form");
    }, 1000); // 1 second delay
  };

  return (
    <section className="text-gray-800 py-20 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="text-center md:text-left md:w-1/2 space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <img
              src="/images/logo-below.png"
              alt="Logo Below"
              className="w-16 md:w-20 object-contain drop-shadow-lg"
            />
            <img
              src="/images/akesk-logo.png"
              alt="AKESK Logo"
              className="w-48 md:w-60 object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Aga Khan Education Service, Kenya.
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Help us capture accurate and up-to-date professional and academic
            data through this form.
          </p>

          <button
            onClick={handleStart}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 bg-green-800 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition hover:bg-green-700 disabled:opacity-50`}
          >
            {loading ? (
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
                Loading form...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </div>

        {/* Verge Logo */}
        <div className="flex flex-col items-center md:items-end md:w-1/2 space-y-4 px-6 md:px-0 md:pr-8">
          <p className="text-base md:text-lg font-semibold uppercase tracking-wider text-gray-600">
            In Partnership With
          </p>
          <img
            src="/images/verge-logo.png"
            alt="Verge Advisory Logo"
            className="w-60 sm:w-80 md:w-110 object-contain drop-shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
