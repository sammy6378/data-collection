import { useEffect } from "react";
import { createPortal } from "react-dom";
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
  Award,
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
  const isOpen = !!applicant;

  // ESC key to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!applicant) return null;

  const getJobTypeColor = (jobType) => {
    switch (jobType?.toLowerCase()) {
      case "permanent":   return "bg-green-100 text-green-800 border-green-200";
      case "contractual": return "bg-blue-100 text-blue-800 border-blue-200";
      case "intern":      return "bg-purple-100 text-purple-800 border-purple-200";
      case "volunteer":   return "bg-orange-100 text-orange-800 border-orange-200";
      default:            return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${applicant.name} details`}
        className="relative ml-auto w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col
                   animate-[slideInRight_0.3s_ease-out]"
        style={{ animation: "slideInRight 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold leading-tight">{applicant.name}</h2>
                <p className="text-blue-100">{applicant.jobTitle}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getJobTypeColor(applicant.jobType)}`}>
                    {applicant.jobType}
                  </span>
                  <span className="text-blue-200 text-xs flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {applicant.createdAt ? formatDate(applicant.createdAt) : "—"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors group flex-shrink-0"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            <InfoCard icon={<MapPin className="w-4 h-4" />} title="Location" value={[applicant.location, applicant.country].filter(Boolean).join(", ")} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
            <InfoCard icon={<GraduationCap className="w-4 h-4" />} title="Education" value={applicant.educationLevel} bgColor="bg-purple-50" iconColor="text-purple-600" />
            <InfoCard icon={<Building className="w-4 h-4" />} title="Department" value={applicant.department} bgColor="bg-blue-50" iconColor="text-blue-600" />
          </div>

          {/* Professional Info */}
          <Section title="Professional Information" icon={<Briefcase className="w-4 h-4" />}>
            <DetailItem label="Job Title"   value={applicant.jobTitle} />
            <DetailItem label="Job Type"    value={applicant.jobType} />
            <DetailItem label="Supervisor"  value={applicant.supervisor} />
            <DetailItem label="Department"  value={applicant.department} />
            <DetailItem label="Section"     value={applicant.section} />
          </Section>

          {/* Location */}
          <Section title="Location Details" icon={<MapPin className="w-4 h-4" />}>
            <DetailItem label="Location" value={applicant.location} />
            <DetailItem label="Country"  value={applicant.country} />
          </Section>

          {/* Education */}
          <Section title="Education & Qualifications" icon={<GraduationCap className="w-4 h-4" />}>
            <DetailItem label="Education Level"  value={applicant.educationLevel} />
            {applicant.qualifications  && <DetailItem label="Qualifications"  value={applicant.qualifications} />}
            {applicant.otherEducation  && <DetailItem label="Other Education" value={applicant.otherEducation} />}
            {applicant.otherSkills     && <DetailItem label="Other Skills"    value={applicant.otherSkills} />}
          </Section>

          {/* Experience */}
          {Array.isArray(applicant.experienceList) && applicant.experienceList.length > 0 && (
            <Section title="Professional Experience" icon={<Clock className="w-4 h-4" />}>
              <div className="space-y-3">
                {applicant.experienceList.map((exp, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate">{exp.positionHeld || exp.organization || "—"}</p>
                          <span className="text-xs text-gray-500 flex-shrink-0">{exp.years || "—"}</span>
                        </div>
                        {exp.positionHeld && <p className="text-sm text-gray-600 mb-2">{exp.organization || "—"}</p>}
                        {exp.contributions && (
                          <div className="bg-white rounded p-3 border border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Key Contributions</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{exp.contributions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* CV */}
          <Section title="Documents" icon={<Award className="w-4 h-4" />}>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              {applicant.cvFile ? (
                <a
                  href={applicant.cvFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              ) : (
                <p className="text-sm text-gray-500">No CV uploaded for this applicant.</p>
              )}
            </div>
          </Section>
        </div>
      </aside>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
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
