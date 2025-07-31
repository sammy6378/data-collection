import { useEffect, useState } from "react";
import ViewApplicantModal from "./ViewApplicantModal";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Footer from "./Footer"

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [eduFilter, setEduFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:7071/api/getsubmissions")
  .then((res) => res.json())
  .then((data) => {
    const sorted = data.data.sort((a, b) => new Date(b._ts) - new Date(a._ts));
    setSubmissions(sorted);
    setFiltered(sorted);
    setLoading(false);
  })

      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredData = submissions.filter((sub) => {
      const jobMatch = jobTypeFilter ? sub.jobType === jobTypeFilter : true;
      const eduMatch = eduFilter ? sub.educationLevel === eduFilter : true;
      return jobMatch && eduMatch;
    });
    setFiltered(filteredData);
    setPage(1); // reset page when filters change
  }, [jobTypeFilter, eduFilter, submissions]);

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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




      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by Job Type</option>
          <option value="Permanent">Permanent</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
        <select
          onChange={(e) => setEduFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by Education</option>
          <option value="High School Only">High School Only</option>
          <option value="Diploma/Professional Qualification">Diploma</option>
          <option value="Master’s + Diploma/Professional Qualification">Master's + Diploma</option>
        </select>
      </div>

      {/* Content Display */}
      {loading ? (
        <div className="flex justify-center items-center my-10">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-blue-600">Loading submissions...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 my-10">❗ No submissions found with the current filters.</div>
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
                  <th className="p-3 border-b">Submitted</th>
                  <th className="p-3 border-b">CV</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {paginated.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.jobTitle}</td>
                    <td className="p-3">{item.jobType}</td>
                    <td className="p-3">{item.educationLevel}</td>
                    <td className="p-3">
                      {new Date(item._ts * 1000).toLocaleString("en-KE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZoneName: "short",
                      })}
                    </td>
                    <td className="p-3">
                      <a
                        href={item.cvBlobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Download
                      </a>
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
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
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
      <ViewApplicantModal applicant={selected} onClose={() => setSelected(null)} />
        <Footer />
    </div>
  );
};

export default AdminDashboard;
