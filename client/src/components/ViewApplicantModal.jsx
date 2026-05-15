import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Briefcase,
  Clock,
  MapPin,
  GraduationCap,
  Building,
  Calendar,
  Download,
  FileText,
} from "lucide-react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  const day = date.getDate();
  const suffix = day > 3 && day < 21 ? "th" : ["th","st","nd","rd"][day % 10] ?? "th";
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${day}${suffix} ${month}, ${year} · ${h}:${m}${ampm}`;
};

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const avatarColor = (name = "") => {
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-emerald-500",
    "bg-rose-500",   "bg-amber-500", "bg-cyan-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx] ?? "bg-slate-500";
};

const JOB_TYPE_STYLES = {
  permanent:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
  contractual: "bg-blue-50   text-blue-700   ring-blue-200",
  contract:    "bg-blue-50   text-blue-700   ring-blue-200",
  internship:  "bg-violet-50 text-violet-700 ring-violet-200",
  intern:      "bg-violet-50 text-violet-700 ring-violet-200",
  volunteer:   "bg-amber-50  text-amber-700  ring-amber-200",
};

const jobTypeBadge = (type = "") =>
  JOB_TYPE_STYLES[type.toLowerCase()] ?? "bg-gray-100 text-gray-600 ring-gray-200";

// ─── Sub-components ──────────────────────────────────────────────────────────

const Tab = ({ label, icon, active, onClick }) => (
  <button
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
      ${active
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
  >
    {icon}
    {label}
  </button>
);

const Field = ({ label, value }) =>
  value ? (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  ) : null;

const SectionHeading = ({ children }) => (
  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
    {children}
  </h3>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ViewApplicantModal = ({ applicant, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const closeRef = useRef(null);
  const isOpen = !!applicant;

  // Focus close button on open
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
    else setActiveTab("overview");
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!applicant) return null;

  const tabs = [
    { id: "overview",    label: "Overview",    icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: "experience",  label: "Experience",  icon: <Clock      className="w-3.5 h-3.5" /> },
    { id: "documents",   label: "Documents",   icon: <FileText   className="w-3.5 h-3.5" /> },
  ];

  return createPortal(
    <>
      <style>{`
        @keyframes drawer-in  { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes overlay-in { from { opacity: 0 }                  to { opacity: 1 }              }
        .drawer-overlay { animation: overlay-in 0.25s ease forwards; }
        .drawer-panel   { animation: drawer-in  0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      <div className="fixed inset-0 z-50 flex" role="presentation">
        {/* Overlay */}
        <div
          className="drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="drawer-panel relative ml-auto flex flex-col w-full max-w-[50%] h-full bg-white shadow-2xl"
        >
          {/* ── Header ── */}
          <header className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`${avatarColor(applicant.name)} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-sm font-bold tracking-wide">
                  {getInitials(applicant.name)}
                </span>
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <h2 id="drawer-title" className="text-lg font-semibold text-gray-900 truncate">
                  {applicant.name}
                </h2>
                <p className="text-sm text-gray-500 truncate">{applicant.jobTitle}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${jobTypeBadge(applicant.jobType)}`}>
                    {applicant.jobType}
                  </span>
                  {applicant.createdAt && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(applicant.createdAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* Close */}
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close"
                className="flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div role="tablist" className="flex gap-1 mt-4 -mb-4 overflow-x-auto">
              {tabs.map((t) => (
                <Tab key={t.id} {...t} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
              ))}
            </div>
          </header>

          {/* ── Scrollable Body ── */}
          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="p-6 space-y-8">
                {/* Role */}
                <section>
                  <SectionHeading>Role</SectionHeading>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field label="Job Title"   value={applicant.jobTitle} />
                    <Field label="Job Type"    value={applicant.jobType} />
                    <Field label="Department"  value={applicant.department} />
                    <Field label="Section"     value={applicant.section} />
                    <Field label="Supervisor"  value={applicant.supervisor} />
                  </dl>
                </section>

                {/* Location */}
                <section>
                  <SectionHeading>Location</SectionHeading>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field label="Office"  value={applicant.location} />
                    <Field label="Country" value={applicant.country} />
                  </dl>
                </section>

                {/* Education */}
                <section>
                  <SectionHeading>Education & Skills</SectionHeading>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field label="Education Level"  value={applicant.educationLevel} />
                    <Field label="School"           value={applicant.school} />
                    <Field label="Qualifications"   value={applicant.qualifications} />
                    <Field label="Other Education"  value={applicant.otherEducation} />
                  </dl>
                  {applicant.otherSkills && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Other Skills</dt>
                      <dd className="text-sm text-gray-700 leading-relaxed">{applicant.otherSkills}</dd>
                    </div>
                  )}
                </section>

                {/* Experience Summary */}
                {applicant.experienceSummary && (
                  <section>
                    <SectionHeading>Experience Summary</SectionHeading>
                    <p className="text-sm text-gray-700 leading-relaxed">{applicant.experienceSummary}</p>
                  </section>
                )}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="p-6">
                {Array.isArray(applicant.experienceList) && applicant.experienceList.length > 0 ? (
                  <ol className="relative border-l border-gray-200 space-y-0">
                    {applicant.experienceList.map((exp, idx) => (
                      <li key={idx} className="ml-6 pb-8 last:pb-0">
                        {/* Timeline dot */}
                        <span className="absolute -left-2.5 flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full ring-4 ring-white">
                          <Building className="w-2.5 h-2.5 text-blue-600" />
                        </span>

                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <p className="font-semibold text-gray-900 text-sm leading-snug">
                              {exp.positionHeld || exp.organization || "—"}
                            </p>
                            {exp.years && (
                              <span className="flex-shrink-0 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                {exp.years}
                              </span>
                            )}
                          </div>
                          {exp.positionHeld && exp.organization && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                              <MapPin className="w-3 h-3" />
                              {exp.organization}
                            </div>
                          )}
                          {exp.contributions && (
                            <>
                              <div className="border-t border-gray-100 pt-3 mt-2">
                                <p className="text-xs font-medium text-gray-500 mb-1.5">Key Contributions</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{exp.contributions}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <Clock className="w-10 h-10 opacity-30" />
                    <p className="text-sm">No experience entries recorded.</p>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="p-6">
                <SectionHeading>Uploaded Files</SectionHeading>
                {applicant.cvFile ? (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Curriculum Vitae</p>
                      <p className="text-xs text-gray-400">CV document attached</p>
                    </div>
                    <a
                      href={applicant.cvFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Open
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <FileText className="w-10 h-10 opacity-30" />
                    <p className="text-sm">No documents uploaded.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {applicant.cvFile && (
            <footer className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <a
                href={applicant.cvFile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </footer>
          )}
        </aside>
      </div>
    </>,
    document.body
  );
};

export default ViewApplicantModal;
