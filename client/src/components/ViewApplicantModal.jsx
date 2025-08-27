import React from "react";
import {
  X,
  User,
  Briefcase,
  Clock,
  MapPin,
  GraduationCap,
  Building,
  Calendar,
  Download,
  Mail,
  Phone,
  Award,
  Target,
} from "lucide-react";

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
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Get month name
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];

  // Get year
  const year = date.getFullYear();

  // Get time in 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  return `${day}${daySuffix(
    day
  )} ${month}, ${year} ${hours}:${minutes}${ampm} EAT`;
};

const ViewApplicantModal = ({ applicant, onClose }) => {
  if (!applicant) return null;

  const getJobTypeColor = (jobType) => {
    switch (jobType?.toLowerCase()) {
      case "permanent":
        return "bg-green-100 text-green-800 border-green-200";
      case "contractual":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "intern":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "volunteer":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{applicant.name}</h2>
              <p className="text-blue-100 text-lg">{applicant.jobTitle}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getJobTypeColor(
                    applicant.jobType
                  )}`}
                >
                  {applicant.jobType}
                </span>
                <span className="text-blue-200 text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {applicant.createdAt ? formatDate(applicant.createdAt) : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <InfoCard
              icon={<MapPin className="w-5 h-5" />}
              title="Location"
              value={`${applicant.location}, ${applicant.country}`}
              bgColor="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <InfoCard
              icon={<GraduationCap className="w-5 h-5" />}
              title="Education"
              value={applicant.educationLevel}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <InfoCard
              icon={<Building className="w-5 h-5" />}
              title="Department"
              value={applicant.department}
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <Section
                title="Professional Information"
                icon={<Briefcase className="w-5 h-5" />}
              >
                <DetailItem label="Job Title" value={applicant.jobTitle} />
                <DetailItem label="Job Type" value={applicant.jobType} />
                <DetailItem label="Supervisor" value={applicant.supervisor} />
                <DetailItem label="Department" value={applicant.department} />
                <DetailItem label="Section" value={applicant.section} />
              </Section>

              <Section
                title="Location Details"
                icon={<MapPin className="w-5 h-5" />}
              >
                <DetailItem label="Location" value={applicant.location} />
                <DetailItem label="Country" value={applicant.country} />
              </Section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Section
                title="Education & Qualifications"
                icon={<GraduationCap className="w-5 h-5" />}
              >
                <DetailItem
                  label="Education Level"
                  value={applicant.educationLevel}
                />
                {applicant.qualifications && (
                  <DetailItem
                    label="Qualifications"
                    value={applicant.qualifications}
                  />
                )}
                {applicant.otherEducation && (
                  <DetailItem
                    label="Other Education"
                    value={applicant.otherEducation}
                  />
                )}
                {applicant.otherSkills && (
                  <DetailItem
                    label="Other Skills"
                    value={applicant.otherSkills}
                  />
                )}
              </Section>
            </div>
          </div>

          {/* Experience Section */}
          {applicant.experienceSummary && (
            <Section
              title="Experience Summary"
              icon={<Target className="w-5 h-5" />}
              className="mt-8"
            >
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 leading-relaxed">
                {applicant.experienceSummary}
              </div>
            </Section>
          )}

          {/* Experience List */}
          {Array.isArray(applicant.experienceList) &&
            applicant.experienceList.length > 0 && (
              <Section
                title="Experience Timeline"
                icon={<Clock className="w-5 h-5" />}
                className="mt-8"
              >
                <div className="space-y-3">
                  {applicant.experienceList.map((exp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-blue-500"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {exp.organization || "—"}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {exp.years ? `Years: ${exp.years}` : "Years: —"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

          {/* CV Download Section */}
          <Section
            title="Documents"
            icon={<Award className="w-5 h-5" />}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              {applicant.cvFile ? (
                <a
                  href={applicant.cvFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download CV</span>
                </a>
              ) : (
                <div className="flex items-center space-x-3 text-gray-500">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">No CV uploaded</p>
                    <p className="text-sm">
                      CV not available for this applicant
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

// Modern Info Card Component
const InfoCard = ({ icon, title, value, bgColor, iconColor }) => (
  <div className={`${bgColor} rounded-xl p-4 border border-gray-100`}>
    <div className="flex items-center space-x-3">
      <div className={`${iconColor}`}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </p>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {value || "—"}
        </p>
      </div>
    </div>
  </div>
);

// Section Component
const Section = ({ title, icon, children, className = "" }) => (
  <div className={`${className}`}>
    <div className="flex items-center space-x-2 mb-4">
      <div className="text-blue-600">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

// Detail Item Component
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span
      className="text-sm text-gray-900 text-right max-w-xs truncate"
      title={value}
    >
      {value || "—"}
    </span>
  </div>
);

export default ViewApplicantModal;
