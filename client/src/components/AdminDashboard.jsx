import { useEffect, useState } from "react";
import ViewApplicantModal from "./ViewApplicantModal";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Footer from "./Footer";

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

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [eduFilter, setEduFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ search query state
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [autoRefresh, setAutoRefresh] = useState(true); // ✅ auto refresh toggle
  const [lastUpdated, setLastUpdated] = useState(null); // ✅ last update time

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  // Use proxy in development, direct URL in production
  const url = import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_URL || "http://localhost:8000";
  console.log("🔧 API URL configured as:", url);
  console.log("🔧 Environment variables:", import.meta.env);

  // Function to fetch data
  const fetchData = () => {
    setLoading(true);
    console.log("🔄 Fetching data from:", `${url}/get-data`);

    fetch(`${url}/get-data`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("📡 Response status:", res.status);
        console.log("📡 Response headers:", res.headers);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Data received:", data);
        const sorted = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSubmissions(sorted);
        setFiltered(sorted);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        console.error("❌ Error details:", {
          name: err.name,
          message: err.message,
          stack: err.stack,
        });

        // Try a simpler fetch as fallback
        console.log("🔄 Attempting fallback fetch...");
        return fetch(`${url}/get-data`)
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Fallback fetch successful:", data);
            const sorted = data.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setSubmissions(sorted);
            setFiltered(sorted);
            setLastUpdated(new Date());
          })
          .catch((fallbackErr) => {
            console.error("❌ Fallback fetch also failed:", fallbackErr);
          })
          .finally(() => {
            setLoading(false);
          });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  useEffect(() => {
    const filteredData = submissions.filter((sub) => {
      const jobMatch = jobTypeFilter ? sub.jobType === jobTypeFilter : true;
      const eduMatch = eduFilter ? sub.educationLevel === eduFilter : true;

      // Search functionality - search across multiple fields
      const searchMatch = searchQuery
        ? sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.jobType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.educationLevel
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (Array.isArray(sub.experienceList) &&
            sub.experienceList.some(
              (exp) =>
                exp.positionHeld
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                exp.organization
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase())
            ))
        : true;

      return jobMatch && eduMatch && searchMatch;
    });
    setFiltered(filteredData);
    setPage(1); // reset page when filters change
  }, [jobTypeFilter, eduFilter, searchQuery, submissions]);

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        {/* Row: Home left, Logo right */}
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition border border-blue-200 rounded-full px-3 py-1 bg-blue-50"
          >
            <Home className="w-4 h-4" /> Home
          </Link>

          <img
            src="/images/verge-logo.png"
            alt="Logo"
            className="h-[40px] sm:h-15 w-auto object-contain"
          />
        </div>

        {/* Title: centered below */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-4 text-center">
          Staff Data Submissions
        </h2>
      </div>

      {/* Auto Refresh Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Now"}
          </button>
        </div>
        {lastUpdated && (
          <div className="text-xs text-gray-500">
            Last updated: {formatDate(lastUpdated.toISOString())}
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search by name, job title, education, or experience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 pl-10 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by Job Type</option>
          <option value="Permanent">Permanent</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
        <select
          value={eduFilter}
          onChange={(e) => setEduFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by Education</option>
          <option value="High School Only">High School Only</option>
          <option value="Diploma/Professional Qualification">Diploma</option>
          <option value="Master's + Diploma/Professional Qualification">
            Master's + Diploma
          </option>
        </select>

        {/* Clear Filters Button */}
        {(searchQuery || jobTypeFilter || eduFilter) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setJobTypeFilter("");
              setEduFilter("");
            }}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition border border-gray-300"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Content Display */}
      {loading ? (
        <div className="flex justify-center items-center my-10">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-blue-600">Loading submissions...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 my-10">
          ❗ No submissions found with the current search criteria and filters.
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 text-left">
                <tr>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Job Title</th>
                  <th className="p-3 border-b">Job Type</th>
                  <th className="p-3 border-b">Education</th>
                  <th className="p-3 border-b">Experience</th>
                  <th className="p-3 border-b">Submitted</th>
                  <th className="p-3 border-b">CV</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {paginated.map((item, i) => (
                  <tr
                    key={item.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.jobTitle}</td>
                    <td className="p-3">{item.jobType}</td>
                    <td className="p-3">{item.educationLevel}</td>
                    <td className="p-3">
                      {Array.isArray(item.experienceList) &&
                      item.experienceList.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {item.experienceList.map((exp, idx) => (
                            <li key={idx} className="mb-1">
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">
                                  {exp.positionHeld || exp.organization}
                                </span>
                                {exp.organization && exp.positionHeld && (
                                  <span className="text-gray-500">
                                    {" "}
                                    at {exp.organization}
                                  </span>
                                )}
                                {exp.years && (
                                  <span className="text-gray-500">
                                    {" "}
                                    ({exp.years})
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No experience</span>
                      )}
                    </td>
                    <td className="p-3">{formatDate(item.createdAt)}</td>
                    <td className="p-3">
                      {item.cvFile ? (
                        <a
                          href={item.cvFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Download CV
                        </a>
                      ) : (
                        <span className="text-gray-400">No CV</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelected(item)}
                        className="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <div className="text-gray-600">
              Showing page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
            </div>
            <div className="space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <ViewApplicantModal
        applicant={selected}
        onClose={() => setSelected(null)}
      />
      <Footer />
    </div>
  );
};

export default AdminDashboard;
