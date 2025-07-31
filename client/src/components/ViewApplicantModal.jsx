import React from "react";

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  
  // Get day with suffix
  const day = date.getDate();
  const daySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  // Get month name
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = months[date.getMonth()];
  
  // Get year
  const year = date.getFullYear();
  
  // Get time in 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${day}${daySuffix(day)} ${month}, ${year} ${hours}:${minutes}${ampm} EAT`;
};

const ViewApplicantModal = ({ applicant, onClose }) => {
  if (!applicant) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white text-gray-900 rounded-xl p-6 w-full max-w-3xl shadow-2xl relative border border-gray-200 transition-all duration-300 ease-in-out">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-semibold"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">📄 Applicant Details</h2>

        {/* Grid Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <Info label="Name" value={applicant.name} />
          <Info label="Job Title" value={applicant.jobTitle} />
          <Info label="Job Type" value={applicant.jobType} />
          <Info label="Supervisor" value={applicant.supervisor} />
          <Info label="Department" value={applicant.department} />
          <Info label="Section" value={applicant.section} />
          <Info label="School" value={applicant.school} />
          <Info label="Location" value={applicant.location} />
          <Info label="Country" value={applicant.country} />
          <Info label="Education Level" value={applicant.educationLevel} />
          <Info label="Qualifications" value={applicant.qualifications || "—"} />
          <Info label="Other Education" value={applicant.otherEducation || "—"} />
          <Info label="Other Skills" value={applicant.otherSkills || "—"} />

          {/* Submission Date */}
          <Info label="Submitted On" value={applicant.createdAt ? formatDate(applicant.createdAt) : "—"} />

          {/* Experience Summary */}
          <div className="sm:col-span-2">
            <span className="block text-gray-600 font-semibold mb-1">Experience Summary:</span>
            <p>{applicant.experienceSummary}</p>
          </div>

          {/* Experience List */}
          {Array.isArray(applicant.experienceList) && applicant.experienceList.length > 0 && (
            <div className="sm:col-span-2">
              <span className="block text-gray-600 font-semibold mb-1">Experience List:</span>
              <ul className="list-disc ml-6 space-y-1">
                {applicant.experienceList.map((exp, idx) => (
                  <li key={idx}>
                    <strong>{exp.organization}</strong> — {exp.years}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CV Download */}
          <div className="sm:col-span-2">
            <span className="block text-gray-600 font-semibold mb-1">CV:</span>
            {applicant.cvFile ? (
              <a
                href={applicant.cvFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:underline font-medium"
              >
                📎 Download CV
              </a>
            ) : (
              <span className="text-gray-500 italic">No CV uploaded</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable info block
const Info = ({ label, value }) => (
  <div>
    <span className="block text-gray-600 font-semibold mb-1">{label}:</span>
    <span>{value}</span>
  </div>
);

export default ViewApplicantModal;
