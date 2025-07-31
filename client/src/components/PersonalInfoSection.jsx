import { useFormContext } from "react-hook-form";
import FormInput from "./FormInput";
import { personalInfoValidation } from "../utils/ValidationRules";

export default function PersonalInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <h2 className="text-2xl font-bold text-teal-800 mb-6">Part A: Job and Personal Data</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="Name" name="name" rules={personalInfoValidation.name} />
        <FormInput label="Job Title" name="jobTitle" rules={personalInfoValidation.jobTitle} />

        {/* Job Type (manual select with asterisk) */}
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
            <p className="text-red-600 text-sm mt-1">{errors.jobType.message}</p>
          )}
        </div>

        <FormInput label="Reports to / Supervisor" name="supervisor" rules={personalInfoValidation.supervisor} />
        <FormInput label="Department" name="department" rules={personalInfoValidation.department} />
        <FormInput label="Section" name="section" rules={personalInfoValidation.section} />
        <FormInput label="School" name="school" rules={personalInfoValidation.school} />
        <FormInput label="Location" name="location" rules={personalInfoValidation.location} />

        <div className="md:col-span-2">
          <FormInput label="Country" name="country" rules={personalInfoValidation.country} />
        </div>
      </div>
    </div>
  );
}
