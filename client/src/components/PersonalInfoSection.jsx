import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "./FormInput";
import { personalInfoValidation } from "../utils/ValidationRules";
import akeskData from "../data/akesk_dropdowns.json";

const data = akeskData;

export default function PersonalInfoSection() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  // Watch current selections
  const selectedDept = watch("department");
  const selectedSection = watch("section");
  const selectedSchool = watch("school");
  const location = watch("location");
  const country = watch("country");

  // Compute options
  const departmentOptions = data.departments || [];
  const sectionOptions = selectedDept
    ? (data.sectionsByDepartment[selectedDept] || []).map((s) =>
        s === "(No Section)" ? "—" : s
      )
    : [];

  const normalizedSection = (val) =>
    !val || val === "—" ? "(No Section)" : val;

  const schoolOptions =
    selectedDept && selectedSection
      ? data.schoolsByDeptSection[selectedDept]?.[
          normalizedSection(selectedSection)
        ] || []
      : [];

  // Reset downstream fields when upstream changes
  useEffect(() => {
    setValue("section", "");
    setValue("school", "");
    setValue("location", "");
    setValue("country", "");
  }, [selectedDept, setValue]);

  useEffect(() => {
    setValue("school", "");
    setValue("location", "");
    setValue("country", "");
  }, [selectedSection, setValue]);

  // Auto-fill location & country
  useEffect(() => {
    if (selectedDept && selectedSection && selectedSchool) {
      const secKey = normalizedSection(selectedSection);
      // Try department-specific first, then fallback to "" key
      let entries = data.nested[selectedDept]?.[secKey];
      if (!entries) {
        entries = data.nested[""]?.[secKey] || [];
      }
      const match = entries.find((e) => e.schoolOffice === selectedSchool);
      if (match) {
        setValue("location", match.location || "");
        setValue("country", match.country || "");
      } else {
        setValue("location", "");
        setValue("country", "");
      }
    } else {
      setValue("location", "");
      setValue("country", "");
    }
  }, [selectedDept, selectedSection, selectedSchool, setValue]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-teal-800 mb-6">
        Part A: Job and Personal Data
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Name"
          name="name"
          rules={personalInfoValidation.name}
        />
        <FormInput
          label="Job Title"
          name="jobTitle"
          rules={personalInfoValidation.jobTitle}
        />

        {/* Job Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("jobType", personalInfoValidation.jobType)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select Job Type</option>
            <option value="Permanent">Permanent</option>
            <option value="Contractual">Contractual</option>
            <option value="Intern">Intern</option>
            <option value="Volunteer">Volunteer</option>
          </select>
          {errors.jobType && (
            <p className="text-red-600 text-sm mt-1">
              {errors.jobType.message}
            </p>
          )}
        </div>

        <FormInput
          label="Reports to / Supervisor"
          name="supervisor"
          rules={personalInfoValidation.supervisor}
        />

        {/* Department */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            {...register("department", personalInfoValidation.department)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            defaultValue=""
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-600 text-sm mt-1">
              {errors.department.message}
            </p>
          )}
        </div>

        {/* Section */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Section <span className="text-red-500">*</span>
          </label>
          <select
            {...register("section", personalInfoValidation.section)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={!selectedDept}
            defaultValue=""
          >
            <option value="">
              {selectedDept ? "Select Section" : "Select Department first"}
            </option>
            {sectionOptions.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
          {errors.section && (
            <p className="text-red-600 text-sm mt-1">
              {errors.section.message}
            </p>
          )}
        </div>

        {/* School / Office */}
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            School / Office 
          </label>
          <select
            {...register("school", personalInfoValidation.school)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={!selectedDept || !selectedSection}
            defaultValue=""
          >
            <option value="">
              {selectedDept && selectedSection
                ? "Select School / Office"
                : "Select Department and Section first"}
            </option>
            {schoolOptions.map((sch) => (
              <option key={sch} value={sch}>
                {sch}
              </option>
            ))}
          </select>
          {errors.school && (
            <p className="text-red-600 text-sm mt-1">{errors.school.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none"
            readOnly
            {...register("location", personalInfoValidation.location)}
            value={location || ""}
            placeholder="Auto-filled"
          />
          {errors.location && (
            <p className="text-red-600 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none"
            readOnly
            {...register("country", personalInfoValidation.country)}
            value={country || ""}
            placeholder="Auto-filled"
          />
          {errors.country && (
            <p className="text-red-600 text-sm mt-1">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>
    </div>
    
  );
}
